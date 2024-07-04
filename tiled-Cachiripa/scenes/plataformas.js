export class Plataformas{
    constructor(scene){
        this.myScene = scene
    }

    preload(){
        this.myScene.load.image('tilesConstructos', '../assets/img/tilesets/Assets.png')
        this.myScene.load.image('tilesFondo1', '../assets/img/tilesets/TX_Village_Props.png')
        this.myScene.load.image('tilesSubsuelo1', '../assets/img/tilesets/Tileset.png')
        this.myScene.load.image('tilesSubsuelo2', '../assets/img/tilesets/Tileset2.png')
        this.myScene.load.image('tilesSuelo1', '../assets/img/tilesets/TX_Tileset_Ground.png')
        this.myScene.load.image('tilesSuelo2', '../assets/img/tilesets/TX_Tileset_Ground_Darken.png')

        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json/PrototipoNivel1.json')
    }

    create(){
        this.map = this.myScene.make.tilemap({key: 'tilemapJSON'})

        this.tileset1 = this.map.addTilesetImage('Constructos', 'tilesConstructos');
        this.tileset2 = this.map.addTilesetImage('fondo1', 'tilesFondo1');
        this.tileset4 = this.map.addTilesetImage('subsuelo1', 'tilesSubsuelo1');
        this.tileset5 = this.map.addTilesetImage('subsuelo2', 'tilesSubsuelo2');
        this.tileset6 = this.map.addTilesetImage('suelo1', 'tilesSuelo1');
        this.tileset7 = this.map.addTilesetImage('suelo2', 'tilesSuelo2');
        
        this.layer2 = this.map.createLayer("Fondo0", [this.tileset2, this.tileset5], 0, 0)
        this.layer3 = this.map.createLayer("Fondo1", [this.tileset2, this.tileset5, this.tileset6], 0, 0)
        this.layer4 = this.map.createLayer("Fondo2", [this.tileset1, this.tileset2, this.tileset5], 0, 0)
        this.layer1 = this.map.createLayer("Plataformas", [this.tileset1, this.tileset2, this.tileset4, this.tileset5, this.tileset6, this.tileset7], 0, 0)
        
        this.layer1.setCollisionByProperty({ collision: true });
        this.layer1.setCollisionByExclusion([-1], true);
    }
}