# Sheep Reaction V2.0

A playful finger movement and coordination challenge for desk-break entertainment. Match gestures to five jumping sheep across three ten-question stages (3 / 1.8 / 1.1 seconds).

This game has no medical validation. It does not prevent, diagnose or treat disease, and does not accurately measure physiological reaction time. Displayed timings include camera, recognition, confirmation and device delays.

![Preview](docs/screenshot.png)

Run `python -m http.server 8768` in this directory and visit http://localhost:8768 . Public hosting requires HTTPS. Enable the camera, keep one hand fully visible, hold a fist while waiting, then extend the matching fingers. A–E map to thumb through pinky. Each correct answer earns one point. Optional fist/open-hand calibration is available. The animation demo is not scored. The game interface is Chinese.

Camera processing runs in the browser using bundled model/runtime assets. Application code has no configured recording upload, analytics, account or score backend. Hosting providers still receive ordinary asset requests. The camera close control stops video tracks. Microphone access is not requested.

Unpublished release candidate. MIT is proposed for original code and project-created assets; bundled MediaPipe 0.10.14 and the model retain Apache-2.0. See THIRD_PARTY_NOTICES.md. Gameplay and visual style are unchanged.

[Animation preview](docs/demo.gif): unscored demo, no camera footage. The received snapshot displays V2.1 candidate although earlier documents call it V2.0. No gameplay files were changed for publication.

[Privacy and security](SECURITY.md) · [Deployment](docs/DEPLOYMENT.md)
