module Circuitnect.UI {

    export class MapDisplay extends PIXI.DisplayObjectContainer {
        //public stage: Circuitnect.Engine.Map2D<Circuitnect.Engine.EnvironmentMapTile>;
        tileSize: number;

        _map: Circuitnect.Engine.Map2D<Circuitnect.Engine.EnvironmentMapTile>;
        _spriteMap: Circuitnect.Engine.Map2D<PIXI.Sprite>;

        constructor(map: Circuitnect.Engine.Map2D<Circuitnect.Engine.EnvironmentMapTile>, tileSize: number) {
            super();
            this.tileSize = tileSize;
            this._map = map;
            this._spriteMap = new Circuitnect.Engine.Map2D<PIXI.Sprite>(map.bounds, undefined);

            //when sprites get added to our sprite map we will assign them appropriate values
            //and clean up our old sprits
            this._spriteMap.eventSet.addListener(setDatas=> {
                for (var i = 0; i < setDatas.length; i++) {
                    var setData = setDatas[i];
                    if (setData.oldItem != undefined) {
                        this.removeChild(setData.oldItem);
                    }
                    if (setData.item != undefined) {
                        setData.item.pivot.x = 8;
                        setData.item.pivot.y = 8;

                        setData.item.x = setData.pos.x * tileSize + tileSize / 2;
                        setData.item.y = setData.pos.y * tileSize + tileSize / 2;


                        setData.item.width = tileSize;
                        setData.item.height = tileSize;

                        this.addChild(setData.item);
                    }
                }
            });


            map.forEach((item, pos) => {

                this.refreshSprites([pos]);

                //this._spriteMap.set(pos, this.generateSprite(pos, item));

            });

            //every time our base map gets updated we will updated our sprite map accordinglys
            map.eventSet.addListener(setDatas=> {
                for (var i = 0; i < setDatas.length; i++) {
                    var setData = setDatas[i];
                    var centerPoint = setData.pos;
                    var compasPoints = this.getCompassPoints(centerPoint);
                    compasPoints.unshift(centerPoint)

                    this.refreshSprites(compasPoints);



                }
            })
        }



        getCompassPoints(pos: Circuitnect.Engine.Position) {
            var top = { x: pos.x, y: pos.y - 1 };
            var right = { x: pos.x + 1, y: pos.y };
            var bottom = { x: pos.x, y: pos.y + 1 };
            var left = { x: pos.x - 1, y: pos.y };

            return [top, right, bottom, left];
        }

        refreshSprites(positions: Circuitnect.Engine.Position[]) {
            for (var i = 0; i < positions.length; i++) {
                var pos = positions[i];

                var tile = this._map.get(pos);

                if (tile == Circuitnect.Engine.EnvironmentMapTile.Hole) {
                    var sprite = PIXI.Sprite.fromFrame("hole.png");
                    this._spriteMap.set(pos, sprite);

                }
                else {

                    var top = this._map.get({ x: pos.x, y: pos.y - 1 });
                    var topNumber = top == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;

                    var right = this._map.get({ x: pos.x + 1, y: pos.y });
                    var rightNumber = right == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;

                    var bottom = this._map.get({ x: pos.x, y: pos.y + 1 });
                    var bottomNumber = bottom == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;

                    var left = this._map.get({ x: pos.x - 1, y: pos.y });
                    var leftNumber = left == Circuitnect.Engine.EnvironmentMapTile.Dirt ? 1 : 0;

                    var sprite = PIXI.Sprite.fromFrame("dirt-" + topNumber + rightNumber + bottomNumber + leftNumber + ".png");
                    this._spriteMap.set(pos, sprite);
                }
            }
        }



    }
} 