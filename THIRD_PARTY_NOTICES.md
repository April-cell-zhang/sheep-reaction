# Third-party notices

## MediaPipe runtime

Copyright The MediaPipe Authors. Apache License 2.0; full text: [licenses/Apache-2.0.txt](licenses/Apache-2.0.txt).

Bundled unmodified files: vendor/vision_bundle.mjs and all four files in vendor/wasm/.
Version: @mediapipe/tasks-vision 0.10.14. All five files were byte-compared against the official npm tarball on 2026-10-30; all matched.
Source: https://github.com/google-ai-edge/mediapipe
Package: https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.14.tgz
The package declares Apache-2.0 and contains no separate LICENSE or NOTICE file. The complete v0.10.14 upstream LICENSE (https://github.com/google-ai-edge/mediapipe/blob/v0.10.14/LICENSE) is included here without alteration (including its appendix).

## Hand Landmarker model

vendor/hand_landmarker.task is unmodified and byte-identical to Google's float16 version 1 model:
https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task
SHA256: fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1
Official model guide: https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker
Official linked model card states Apache License 2.0:
https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Hand%20Tracking%20%28Lite_Full%29%20with%20Fairness%20Oct%202021.pdf

## Project assets

The farm scene and sheep are drawn procedurally by farm-scene.mjs. Sounds are synthesized with Web Audio. No external fonts, stock photos, music or image downloads are used by the application. Screenshots and the animation preview show this project; animation preview is unscored and contains no camera footage. No endorsement by Google or MediaPipe is implied.
