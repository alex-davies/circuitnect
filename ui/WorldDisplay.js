var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="MapDisplay.ts"/>
///<reference path="ActorListDisplay.ts"/>
var Circuitnect;
(function (Circuitnect) {
    var UI;
    (function (UI) {
        (function (InteractionType) {
            InteractionType[InteractionType["ToggleDirt"] = 0] = "ToggleDirt";
            InteractionType[InteractionType["ToggleMole"] = 1] = "ToggleMole";
            InteractionType[InteractionType["ToggleDigging"] = 2] = "ToggleDigging";
        })(UI.InteractionType || (UI.InteractionType = {}));
        var InteractionType = UI.InteractionType;
        var InteractionManager = (function () {
            function InteractionManager(world, display) {
                var _this = this;
                this.world = world;
                this.display = display;
                this.interactionType = 0 /* ToggleDirt */;
                display.interactive = true;
                display.mousedown = function (data) {
                    var mapPos = _this.toMapPos(data.global);
                    switch (_this.interactionType) {
                        case 0 /* ToggleDirt */:
                            _this.world.actionDispatcher.trigger(new Circuitnect.Engine.ToggleDirtCommand(mapPos));
                            break;
                        case 1 /* ToggleMole */:
                            _this.world.actionDispatcher.trigger(new Circuitnect.Engine.ToggleWorkerCommand(mapPos));
                            break;
                        case 2 /* ToggleDigging */:
                        default:
                            break;
                    }
                };
            }
            InteractionManager.prototype.toMapPos = function (global) {
                var localx = global.x - this.display.worldTransform.tx;
                var localy = global.y - this.display.worldTransform.ty;
                return { x: Math.floor(localx / this.display.tileSize), y: Math.floor(localy / this.display.tileSize) };
            };
            return InteractionManager;
        })();
        UI.InteractionManager = InteractionManager;
        var WorldDisplay = (function (_super) {
            __extends(WorldDisplay, _super);
            function WorldDisplay(world) {
                _super.call(this);
                this.tileSize = 32;
                this.world = world;
                this.addChild(new UI.MapDisplay(this.world.map, this.tileSize));
                this.addChild(new UI.ActorListDisplay(this.world, this.world.actors, this.tileSize));
                this.interactionManager = new InteractionManager(world, this);
            }
            return WorldDisplay;
        })(PIXI.DisplayObjectContainer);
        UI.WorldDisplay = WorldDisplay;
    })(UI = Circuitnect.UI || (Circuitnect.UI = {}));
})(Circuitnect || (Circuitnect = {}));
//# sourceMappingURL=WorldDisplay.js.map