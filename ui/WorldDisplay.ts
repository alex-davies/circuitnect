///<reference path="MapDisplay.ts"/>
///<reference path="ActorListDisplay.ts"/>
module Circuitnect.UI {


    export enum InteractionType {
        ToggleDirt = 0,
        ToggleMole = 1,
        ToggleDigging= 2
    }
    export class InteractionManager {

        public interactionType = InteractionType.ToggleDirt;

        constructor(private world: Circuitnect.Engine.World, private display: Circuitnect.UI.WorldDisplay) {

            display.interactive = true;
            display.mousedown = (data: PIXI.InteractionData) => {
                var mapPos = this.toMapPos(data.global);

                switch (this.interactionType) {
                    case InteractionType.ToggleDirt:
                        this.world.actionDispatcher.trigger(new Circuitnect.Engine.ToggleDirtCommand(mapPos));
                        break;
                    case InteractionType.ToggleMole:
                        this.world.actionDispatcher.trigger(new Circuitnect.Engine.ToggleWorkerCommand(mapPos));
                        break;
                    case InteractionType.ToggleDigging:
                    default:
                        break;
                }

                

            };
        }

        toMapPos(global: PIXI.Point): Circuitnect.Engine.Position {
            var localx = global.x - this.display.worldTransform.tx;
            var localy = global.y - this.display.worldTransform.ty;
            return { x: Math.floor(localx / this.display.tileSize), y: Math.floor(localy / this.display.tileSize) };
        }
    }

    export class WorldDisplay extends PIXI.DisplayObjectContainer {
        public interactionManager: InteractionManager;
        public world: Circuitnect.Engine.World;
        tileSize = 32;

        constructor(world: Circuitnect.Engine.World) {
            super();
            
            this.world = world;

       
            this.addChild(new MapDisplay(this.world.map, this.tileSize));
            this.addChild(new ActorListDisplay(this.world, this.world.actors, this.tileSize));

            this.interactionManager = new InteractionManager(world, this);

           

        }

        

    }

} 