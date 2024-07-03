import { Player } from "./player.js";
import { Plataformas } from "./plataformas.js";
import { Enemy } from "./enemy.js";

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: "level1" });
        this.player = new Player(this);
        this.Plataformas = new Plataformas(this);
    }

    preload() {
        this.load.image('fondo', '../assets/img/fondo/Background_1.png');
        this.load.spritesheet('liebre1', '../assets/img/Enemigos/Liebre/liebre-normal.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('liebre2', '../assets/img/Enemigos/Liebre/liebre-demonio1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('liebre3', '../assets/img/Enemigos/Liebre/liebre-blanca.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('spider', '../assets/img/Enemigos/Araña-Cono/SpiderConeWalk.png', { frameWidth: 94, frameHeight: 79 });

        this.Plataformas.preload();
        this.player.preload();
    }

    create() {
        // Fondo
        this.fondo = this.add.image(0, 0, 'fondo').setOrigin(0, 0);
        this.fondo.displayWidth = this.sys.game.config.width;
        this.fondo.displayHeight = this.sys.game.config.height;

        this.Plataformas.create();
        this.player.create();

        // Instancia de enemigos
        this.enemies = this.physics.add.group();

        let hare1 = new Enemy(this, 800, 200, 'liebre1', 0.6, { width: 50, height: 40, offsetX: 7, offsetY: 12 });
        let hare2 = new Enemy(this, 900, 200, 'liebre2', 0.5, { width: 50, height: 40, offsetX: 7, offsetY: 12 });
        let hare3 = new Enemy(this, 500, 200, 'liebre3', 0.8, { width: 60, height: 50, offsetX: 8, offsetY: 12 });
        let spider = new Enemy(this, 600, 300, 'spider', 0.4, { width: 70, height: 60, offsetX: 12, offsetY: 15 });

        this.enemies.add(hare1);
        this.enemies.add(hare2);
        this.enemies.add(hare3);
        this.enemies.add(spider);

        // Colisiones
        this.physics.add.collider(this.player.Player, this.Plataformas.layer1);
        this.physics.add.collider(this.enemies, this.Plataformas.layer1);
        this.physics.add.collider(this.player.Player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.world.setBounds(0, 0, 1280, 640);

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, 1280, 640);
        this.cameras.main.startFollow(this.player.Player);
        this.cameras.main.setZoom(1.5);
        this.cameras.main.setLerp(0.1, 0.1);

        // Input para el menú de pausa
        this.input.keyboard.on('keydown-P', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        // Lógica de vida
        this.playerHealth = 100; // Ejemplo de vida
        this.physics.add.overlap(this.player.attackHitbox, this.enemies, this.handleAttackEnemyCollision, null, this);
    }

    update(time, delta) {
        this.player.update(time, delta);

        // Actualiza los enemigos
        this.enemies.getChildren().forEach(enemy => {
            enemy.update();
        });
    }

    handlePlayerEnemyCollision(player, enemy) {
        this.player.takeDamage(1, player.x < enemy.x ? 'left' : 'right');
    }

    handleAttackEnemyCollision(hitbox, enemy) {
        enemy.takeDamage(1, hitbox.x < enemy.x ? 'left' : 'right');
    }
}