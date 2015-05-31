var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Circuitnect;
(function (Circuitnect) {
    var UI;
    (function (UI) {
        var ActorDisplay = (function (_super) {
            __extends(ActorDisplay, _super);
            function ActorDisplay(actor, tileSize) {
                _super.call(this, [
                    PIXI.Texture.fromFrame("molewalk-1.png"),
                    PIXI.Texture.fromFrame("molewalk-2.png")
                ]);
                this.actor = actor;
                this.tileSize = tileSize;
                this.animationSpeed = 0.3;
                this.pivot.x = this.width / 2;
                this.pivot.y = this.height / 2;
                this.width = tileSize;
                this.height = tileSize;
            }
            ActorDisplay.prototype.refresh = function (time) {
                this.x = this.actor.pos.x * this.tileSize + this.tileSize / 2;
                this.y = this.actor.pos.y * this.tileSize + this.tileSize / 2;
                var action = this.actor.currentAction;
                if (action.type == Circuitnect.Engine.MoveAction) {
                    var moveAction = action;
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
            };
            return ActorDisplay;
        })(PIXI.MovieClip);
        UI.ActorDisplay = ActorDisplay;
        var ActorListDisplay = (function (_super) {
            __extends(ActorListDisplay, _super);
            function ActorListDisplay(clock, actors, tileSize) {
                var _this = this;
                _super.call(this);
                this.spriteList = new Circuitnect.Engine.List();
                this.actorList = actors;
                this.tileSize = tileSize;
                this.spriteList.removeEvent.addListener(function (removeData) {
                    for (var i = 0; i < removeData.length; i++) {
                        _this.removeChild(removeData[i].item);
                    }
                });
                this.spriteList.addEvent.addListener(function (removeData) {
                    for (var i = 0; i < removeData.length; i++) {
                        _this.addChild(removeData[i].item);
                    }
                });
                actors.forEach(function (item, index) {
                    var sprite = new ActorDisplay(item, tileSize);
                    _this.spriteList.addAt(sprite, index);
                });
                actors.removeEvent.addListener(function (removeData) {
                    for (var i = 0; i < removeData.length; i++) {
                        _this.spriteList.removeIndex(removeData[i].index);
                    }
                });
                actors.addEvent.addListener(function (addData) {
                    for (var i = 0; i < addData.length; i++) {
                        var sprite = new ActorDisplay(addData[i].item, tileSize);
                        _this.spriteList.addAt(sprite, addData[i].index);
                    }
                });
                clock.eventTick.addListener(function (clock) {
                    _this.spriteList.forEach(function (item, index) {
                        item.refresh(clock[0].time);
                    });
                });
            }
            return ActorListDisplay;
        })(PIXI.DisplayObjectContainer);
        UI.ActorListDisplay = ActorListDisplay;
    })(UI = Circuitnect.UI || (Circuitnect.UI = {}));
})(Circuitnect || (Circuitnect = {}));
//# sourceMappingURL=ActorListDisplay.js.map