module Circuitnect.UI {

    export class ActorDisplay extends PIXI.MovieClip {
        constructor(public actor: Circuitnect.Engine.IActor, public tileSize: number) {
            super([
                PIXI.Texture.fromFrame("molewalk-1.png"),
                PIXI.Texture.fromFrame("molewalk-2.png")
            ]);

            this.animationSpeed = 0.3;
            this.pivot.x = this.width / 2;
            this.pivot.y = this.height / 2;
            this.width = tileSize;
            this.height = tileSize;

        }

        refresh(time: number) {
            this.x = this.actor.pos.x * this.tileSize + this.tileSize / 2;
            this.y = this.actor.pos.y * this.tileSize + this.tileSize / 2;

            var action = this.actor.currentAction;
            if (action.type == Circuitnect.Engine.MoveAction) {
                var moveAction = <Circuitnect.Engine.MoveAction> action;
                var fractionComplete = (time - moveAction.startTime) / (moveAction.expectedEndTime - moveAction.startTime);

                if (fractionComplete > 1)
                console.error("action complete and has not triggered", fractionComplete);

                this.x += moveAction.movementOffset.x * this.tileSize * fractionComplete;
                this.y += moveAction.movementOffset.y * this.tileSize * fractionComplete;



                if (moveAction.movementOffset.x < 0)
                    this.scale.x = 1;
                else if (moveAction.movementOffset.x > 0)
                    this.scale.x = -1;



                if (moveAction.movementOffset.x == 0 && moveAction.movementOffset.y == 0) {
                    this.gotoAndStop(0);
                }
                else {
                    this.play();
                }
            }
        }
    }

    export class ActorListDisplay extends PIXI.DisplayObjectContainer {
        tileSize: number;
        actorList: Circuitnect.Engine.List<Circuitnect.Engine.IActor>;
        spriteList: Circuitnect.Engine.List<ActorDisplay> = new Circuitnect.Engine.List<ActorDisplay>();

        constructor(clock: Circuitnect.Engine.IClock, actors: Circuitnect.Engine.List<Circuitnect.Engine.IActor>, tileSize: number) {
            super();
            this.actorList = actors;
            this.tileSize = tileSize;

            this.spriteList.removeEvent.addListener(removeData=> {
                for (var i = 0; i < removeData.length; i++) {
                    this.removeChild(removeData[i].item);
                }
            });
            this.spriteList.addEvent.addListener(removeData=> {
                for (var i = 0; i < removeData.length; i++) {
                    this.addChild(removeData[i].item);
                }
            })

            actors.forEach((item, index) => {
                var sprite = new ActorDisplay(item, tileSize);
                this.spriteList.addAt(sprite, index);
            });

            actors.removeEvent.addListener((removeData) => {
                for (var i = 0; i < removeData.length; i++) {
                    this.spriteList.removeIndex(removeData[i].index);
                }
            });

            actors.addEvent.addListener(addData => {
                for (var i = 0; i < addData.length; i++) {
                    var sprite = new ActorDisplay(addData[i].item, tileSize);
                    this.spriteList.addAt(sprite, addData[i].index);
                }
            });

            clock.eventTick.addListener(clock=> {
                this.spriteList.forEach((item, index) => {
                    item.refresh(clock[0].time);
                });
            });
        }
    }
} 