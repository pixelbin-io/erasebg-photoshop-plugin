import Pixelbin, { transformations } from "@pixelbin/core";
import { PixelbinClient, PixelbinConfig } from "@pixelbin/admin";
import axios from "axios";
import photoshop from "photoshop";
import uxp from "uxp";

// async function getSmartObjectInfo(layerId, docId) {
//     const [res] = await require("photoshop").action.batchPlay(
//         [
//             {
//                 _obj: "get",
//                 _target: [
//                     { _ref: "layer", _id: layerId },
//                     { _ref: "document", _id: docId },
//                 ],
//             },
//         ],
//         { synchronousExecution: false }
//     );

//     if (res.hasOwnProperty("smartObjectMore")) {
//         console.log(res.smartObjectMore);
//     } else {
//         console.error("Layer with id " + layerId + " is not a smart object");
//     }
// }

async function changeLayerPosition(sourceLayer, targetBounds) {
    await photoshop.app.batchPlay(
        [
            {
                _obj: "select",
                _target: [
                    {
                        _ref: "layer",
                        _name: sourceLayer.name,
                    },
                ],
                makeVisible: false,
                layerID: [sourceLayer.id],
                _isCommand: false,
            },
            {
                _obj: "move",
                _target: [
                    {
                        _ref: "layer",
                        _enum: "ordinal",
                        _value: "targetEnum",
                    },
                ],
                to: {
                    _obj: "offset",
                    horizontal: {
                        _unit: "pixelsUnit",
                        _value: targetBounds.left,
                    },
                    vertical: {
                        _unit: "pixelsUnit",
                        _value: targetBounds.top,
                    },
                },
                _options: {
                    dialogOptions: "dontDisplay",
                },
            },
            {
                _obj: "selectNoLayers",
                _target: [
                    {
                        _ref: "layer",
                        _enum: "ordinal",
                        _value: "targetEnum",
                    },
                ],
                _options: {
                    dialogOptions: "dontDisplay",
                },
            },
        ],
        {}
    );
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

export const removeBackground = async ({ appOrgDetails, filters, token }) => {
    const config = new PixelbinConfig({
        domain: "https://api.pixelbin.io",
        apiSecret: token,
    });

    const pixelbin = new PixelbinClient(config);

    const originalImageLayer =
        photoshop.app.activeDocument.activeLayers.at(0);

    await photoshop.core.executeAsModal(async () => {
        // await getSmartObjectInfo(
        //     originalImageLayer._id,
        //     originalImageLayer._docId
        // );

        const originalImagePixels = await photoshop.imaging.getPixels({
            layerID: originalImageLayer.id,
            applyAlpha: true, // for image types with transparent backgrounds that cannot be handled by encodeImageData function below
        });

        const jpegData = await photoshop.imaging.encodeImageData({
            imageData: originalImagePixels.imageData,
            base64: true,
        });

        const imageBuffer = base64ToArrayBuffer(jpegData);
        const imageName = originalImageLayer.name + ".jpeg";

        const folder =
            await uxp.storage.localFileSystem.getTemporaryFolder();

        const uploadImageFile = await folder.createFile(imageName, {
            overwrite: true,
        });

        await uploadImageFile.write(imageBuffer, {
            format: uxp.storage.formats.binary,
        });

        const { presignedUrl } = await pixelbin.assets.createSignedUrlV2({
            path: "__photoshop",
            format: "jpeg",
            filenameOverride: true,
        });

        await Pixelbin.upload(imageBuffer, presignedUrl);

        const { fileId } = JSON.parse(
            presignedUrl.fields["x-pixb-meta-assetdata"]
        );

        // const data = await pixelbin.assets.getFileByFileId({ fileId });

        const pixelbinCore = new Pixelbin({ cloudName: appOrgDetails.org.cloudName });
        const pixelbinImage = pixelbinCore.image(fileId);
        const transformation = transformations.EraseBG.bg(filters);
        pixelbinImage.setTransformation(transformation);

        const transformationURL = pixelbinImage.getUrl().replace("i:", "ta:");

        const { data: transformedImageBuffer } = await axios(
            transformationURL,
            { responseType: "arraybuffer" }
        );

        const transformedImageFile = await folder.createFile(
            originalImageLayer.name + " - background removed",
            { overwrite: true }
        );

        await transformedImageFile.write(transformedImageBuffer, {
            format: uxp.storage.formats.binary,
        });

        const currentDocument = photoshop.app.activeDocument;
        const newDocument = await photoshop.app.open(transformedImageFile);

        const transformedImageLayer =
            await newDocument.activeLayers.at(0).duplicate(currentDocument);

        await newDocument.close(
            photoshop.constants.SaveOptions.DONOTSAVECHANGES
        );

        transformedImageLayer.name =
            originalImageLayer.name + " - background removed";

        await changeLayerPosition(
            transformedImageLayer,
            originalImageLayer.bounds
        );

        transformedImageLayer.move(
            originalImageLayer,
            photoshop.constants.ElementPlacement.PLACEBEFORE
        );

        originalImagePixels.imageData.dispose();

        originalImageLayer.visible = false;
    });
};

export const handle = (promise) => {
    return promise.then((data) => [data, null]).catch((error) => [null, error]);
};
