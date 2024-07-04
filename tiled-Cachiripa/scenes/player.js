export class Player {
    constructor(scene) {
        this.myScene = scene;
        this.health = 3;
        this.isInvincible = false;
        this.attackCooldowns = {
            attackFist: 0,
            attackSlap: 0,
            attackKick: 0
        };
    }

    preload() {
        // Cargar spritesheets
        this.myScene.load.spritesheet('playerRun', '../assets/img/Player/Cachiripa/Cachiripa-Run.png', { frameWidth: 69, frameHeight: 74 });
        this.myScene.load.spritesheet('playerAttack', '../assets/img/Player/Ataques/cachiLoli.png', { frameWidth: 82, frameHeight: 74 });
    }

    create() {
        // Player Ataques
        this.myScene.anims.create({
            key: 'AttackFist',
            frames: this.myScene.anims.generateFrameNumbers('playerAttack', { start: 1, end: 3 }),
            frameRate: 5,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'AttackSlap',
            frames: this.myScene.anims.generateFrameNumbers('playerAttack', { start: 4, end: 6 }),
            frameRate: 5,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'AttackKick',
            frames: this.myScene.anims.generateFrameNumbers('playerAttack', { start: 7, end: 9 }),
            frameRate: 5,
            repeat: 0
        });


        // Player animaciones
        this.myScene.anims.create({
            key: 'Run',
            frames: this.myScene.anims.generateFrameNumbers('playerRun', { start: 5, end: 10 }),
            frameRate: 20,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'Idle',
            frames: [{ key: 'playerRun', frame: 0 }],
            frameRate: 20,
        });

        this.myScene.anims.create({
            key: 'Turn',
            frames: this.myScene.anims.generateFrameNumbers('playerRun', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'Jump',
            frames: this.myScene.anims.generateFrameNumbers('playerRun', { start: 12, end: 13 }),
            frameRate: 10,
            repeat: 1
        });

        this.myScene.anims.create({
            key: 'Fall',
            frames: [{ key: 'playerRun', frame: 14 }],
            frameRate: 10,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'Land',
            frames: [{ key: 'playerRun', frame: 15 }],
            frameRate: 10,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'Hurt',
            frames: [{ key: 'playerAttack', frame: 0 }],
            frameRate: 10,
            repeat: 0
        });

        // Physics y controles
        this.Player = this.myScene.physics.add.sprite(50, 50, 'playerRun');
        this.Player.setScale(0.5);
        this.Player.body.setSize(this.Player.width * 0.4, this.Player.height * 0.6);
        this.Player.body.setOffset(this.Player.width * 0.3, this.Player.height * 0.4);
        this.Player.setBounce(0.2);
        this.Player.setCollideWorldBounds(true);

        // Controles
        this.keyW = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyF = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.keyC = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keyK = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        // Inicializar la dirección
        this.facingDirection = 'right'; // Por defecto a la derecha

        // Crear hitbox de ataque
        this.attackHitbox = this.myScene.physics.add.sprite(this.Player.x, this.Player.y, null);
        this.attackHitbox.body.setSize(40, 40);  // Ajustar tamaño según sea necesario
        this.attackHitbox.setVisible(false);
        this.attackHitbox.body.allowGravity = false;
        this.attackHitbox.body.setEnable(false); // Inicialmente desactivar
    }

    update(time, delta) {
        if (this.isInvincible) return;

        // Lógica de control
        if (!this.isAttacking) {
            if (this.keyD.isDown) {
                this.Player.setVelocityX(160);
                this.Player.play('Run', true);
                this.Player.flipX = false;
                this.facingDirection = 'right';
            } else if (this.keyA.isDown) {
                this.Player.setVelocityX(-160);
                this.Player.play('Run', true);
                this.Player.flipX = true;
                this.facingDirection = 'left';
            } else {
                this.Player.setVelocityX(0);
                this.Player.play('Idle', true);
            }

            // Control de salto
            if (this.keyW.isDown && this.Player.body.blocked.down) {
                this.Player.setVelocityY(-200);
                this.Player.play('Jump', true);
            }
        }

        // Control de caída
        if (!this.Player.body.touching.down) {
            if (this.Player.body.velocity.y > 0) {
                this.Player.anims.play('Fall', true);
            }
        }

        // Control de aterrizaje
        if (this.Player.body.touching.down && this.Player.anims.currentAnim.key === 'Fall') {
            this.Player.anims.play('Land', true);
        }

        // Ataques con cooldown
        if (Phaser.Input.Keyboard.JustDown(this.keyF) && time > this.attackCooldowns.attackFist) {
            this.attack('AttackFist', time, 2000);
        } else if (Phaser.Input.Keyboard.JustDown(this.keyC) && time > this.attackCooldowns.attackSlap) {
            this.attack('AttackSlap', time, 2000);
        } else if (Phaser.Input.Keyboard.JustDown(this.keyK) && time > this.attackCooldowns.attackKick) {
            this.attack('AttackKick', time, 2000);
        }

        // Mover hitbox de ataque con el jugador
        if (this.facingDirection === 'right') {
            this.attackHitbox.setPosition(this.Player.x + 20, this.Player.y);
        } else {
            this.attackHitbox.setPosition(this.Player.x - 20, this.Player.y);
        }
    }

    attack(attackKey, time, cooldown) {
        this.isAttacking = true;
        this.Player.play(attackKey, true);

        // Actualizar el cooldown del ataque
        this.attackCooldowns[attackKey.toLowerCase()] = time + cooldown;

        // Activar hitbox de ataque
        this.attackHitbox.body.setEnable(true);

        // Mantener el último frame de la animación por un segundo
        this.Player.on('animationcomplete', () => {
            this.Player.anims.stop();
            this.Player.setFrame(this.Player.anims.currentAnim.frames.length - 1);
            this.myScene.time.delayedCall(1000, () => {
                this.isAttacking = false;
                this.attackHitbox.body.setEnable(false);
            }, [], this);
        }, this);
    }

    takeDamage(amount, direction) {
        if (this.isInvincible) return;

        this.health -= amount;
        if (this.health <= 0) {
            this.myScene.scene.start('GameOverScene');
            return;
        }

        this.isInvincible = true;
        this.Player.setVelocityY(direction === 'left' ? 200 : -200);
        this.Player.setVelocityX(direction === 'left' ? 200 : -200); // Lanzar hacia atrás
        this.Player.play('Hurt', true);

        // Parpadear el sprite
        this.myScene.tweens.add({
            targets: this.Player,
            alpha: 0,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.isInvincible = false;
                this.Player.setAlpha(1);
            }
        });
    }
}
