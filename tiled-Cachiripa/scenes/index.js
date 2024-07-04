import { StartScene } from "./startScene.js";
import { Level1 } from "./level1.js";
import { GameOverScene } from "./gameOverScene.js";
import { PauseScene } from "./pauseScene.js";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [StartScene, Level1, GameOverScene, PauseScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
}

let game = new Phaser.Game(config);