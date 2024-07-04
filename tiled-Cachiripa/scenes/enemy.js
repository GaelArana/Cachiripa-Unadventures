export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, scale, bodyConfig) {
        super(scene, x, y, texture);
        this.setScale(scale);
        this.health = 5;
        this.isInvincible = false;
        this.myScene = scene;
        this.myScene.physics.world.enable(this);
        this.myScene.add.existing(this);
        this.setCollideWorldBounds(true);
    
        this.body.setGravityY(300);
        this.body.setSize(bodyConfig.width, bodyConfig.height);
        this.body.setOffset(bodyConfig.offsetX, bodyConfig.offsetY);
        this.isMovingRight = true;
        this.initAnimations(); // Llamar a initAnimations() después de que se haya establecido la textura
    }

    initAnimations() {
        let textureKey = this.texture.key; // Obtener la clave de la textura actual
    
        // Configurar animaciones basadas en la clave de textura actual
        if (textureKey.startsWith('liebre')) {
            this.myScene.anims.create({
                key: 'hareMove',
                frames: this.myScene.anims.generateFrameNumbers(textureKey, { start: 12, end: 14 }),
                frameRate: 10,
                repeat: -1
            });
            this.myScene.anims.create({
                key: 'hareHurt',
                frames: [{ key: textureKey, frame: 53 }],
                frameRate: 10,
                repeat: 0
            });
        } else if (textureKey === 'spider') {
            this.myScene.anims.create({
                key: 'spiderMove',
                frames: this.myScene.anims.generateFrameNumbers('spider', { start: 2, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
            this.myScene.anims.create({
                key: 'spiderHurt',
                frames: [{ key: 'spider', frame: 0 }],
                frameRate: 10,
                repeat: 0
            });
        }
    }

    update() {
        if (this.isInvincible) return;

        if (this.isMovingRight) {
            this.setVelocityX(50);
            // Utilizar la animación adecuada basada en la textura
            this.anims.play(this.texture.key.startsWith('liebre') ? 'hareMove' : 'spiderMove', true);
            this.flipX = true;

            if (this.body.blocked.right) {
                this.isMovingRight = false;
                this.flipX = false;
            }
        } else {
            this.setVelocityX(-50);
            // Utilizar la animación adecuada basada en la textura
            this.anims.play(this.texture.key.startsWith('liebre') ? 'hareMove' : 'spiderMove', true);
            this.flipX = false;

            if (this.body.blocked.left) {
                this.isMovingRight = true;
                this.flipX = true;
            }
        }
    }

    takeDamage(amount, direction) {
        if (this.isInvincible) return;

        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
            return;
        }

        this.isInvincible = true;
        // Utilizar la animación adecuada basada en la textura
        this.anims.play(this.texture.key.startsWith('liebre') ? 'hareHurt' : 'spiderHurt', true);

        // Lanzar hacia atrás
        this.setVelocityY(direction === 'left' ? 200 : -200);
        this.setVelocityX(direction === 'left' ? 200 : -200);

        // Parpadear el sprite
        this.myScene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 100,
            ease: 'Linear',
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.isInvincible = false;
                this.setAlpha(1);
            }
        });
    }
}