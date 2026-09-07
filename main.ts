namespace SpriteKind {
    export const BallKind = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`Checkpoint`, function (sprite, location) {
    timer.throttle("Checkpoint", 1000, function () {
        if (!(HasBall)) {
            sprite.startEffect(effects.confetti, 500)
            music.play(music.stringPlayable("E E G G C5 C5 C5 C5 ", 1000), music.PlaybackMode.InBackground)
            HasBall = true
        }
    })
})
function Levels () {
    LevelsDataArray = [[0, 0, 0]]
    LevelsDataArray.pop()
    LevelsTilemapArray = [
    tilemap`Tutorial`,
    tilemap`Level1`,
    tilemap`Level2`,
    tilemap`Level3`,
    tilemap`Level4`,
    tilemap`Level5`,
    tilemap`Level6`,
    tilemap`Level7`,
    tilemap`Level8`
    ]
    ReadingIndex = 0
    for (let value of LevelsTilemapArray) {
        DefineLevel(LevelsTilemapArray.indexOf(value))
    }
    SaveGame()
}
function ToMirroredImage (Img: Image) {
    TempImg = Img.clone()
    TempImg.flipX()
    return TempImg
}
function DownKick () {
    if (HasBall) {
        if (!(Player.isHittingTile(CollisionDirection.Bottom))) {
            music.play(music.createSoundEffect(WaveShape.Noise, 3311, 712, 137, 128, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            CanGrabBall = false
            HasBall = false
            Ball.setFlag(SpriteFlag.Ghost, false)
            if (tiles.tileAtLocationIsWall(Ball.tilemapLocation())) {
                scene.cameraShake(5, 200)
                HasBall = true
            } else {
                Ball.vy = 150
                Ball.vx = Player.vx
                Player.vy = -175
                scene.cameraShake(4, 200)
                timer.after(250, function () {
                    CanGrabBall = true
                })
            }
        }
    }
}
multiEvents.onOverlapTile(multiEvents.spriteKinds(SpriteKind.Player, SpriteKind.BallKind), multiEvents.tileList(assets.tile`Spring`, assets.tile`Spring0`, assets.tile`Spring1`), function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`Spring`)) {
        sprite.vy = -300
    } else {
        sprite.vy = -250
        if (sprite.kind() == SpriteKind.Player) {
            controller.moveSprite(Player, 0, 0)
            timer.after(250, function () {
                controller.moveSprite(Player, 140, 0)
            })
            if (tiles.tileAtLocationEquals(location, assets.tile`Spring0`)) {
                Player.vx = 250
            } else {
                Player.vx = -250
            }
        } else {
            if (tiles.tileAtLocationEquals(location, assets.tile`Spring0`)) {
                sprite.vx = 200
            } else {
                sprite.vx = -200
            }
        }
    }
    music.play(music.createSoundEffect(WaveShape.Triangle, 578, 3826, 231, 146, 200, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(_1IsInMainMenu)) {
        if (Player.isHittingTile(CollisionDirection.Bottom)) {
            if (HasBall) {
                Player.vy = -175
                music.play(music.createSoundEffect(WaveShape.Square, 869, 1295, 195, 110, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            } else {
                Player.vy = -250
                music.play(music.createSoundEffect(WaveShape.Square, 1250, 2034, 99, 159, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            }
        }
    }
})
function TitleScreen () {
    LoadSave()
    _1IsInMainMenu = true
    TitleSprite = sprites.create(assets.image`Title`, SpriteKind.Food)
    TitleSprite.setPosition(80, 40)
    animation.runMovementAnimation(
    TitleSprite,
    animation.animationPresets(animation.bobbing),
    2000,
    true
    )
    scene.setBackgroundColor(10)
    MainMenu = miniMenu.createMenu(
    miniMenu.createMenuItem("Start")
    )
    miniMenu.setFrame(MainMenu, assets.image`Frame`)
    miniMenu.setStyleProperty(MainMenu, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, images.color_block(6))
    miniMenu.setStyleProperty(MainMenu, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, images.color_block(7))
    miniMenu.setStyleProperty(MainMenu, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, images.color_block(7))
    miniMenu.setStyleProperty(MainMenu, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, images.color_block(3))
    miniMenu.setMenuStyleProperty(MainMenu, miniMenu.MenuStyleProperty.UseAsTemplate, 1)
    MainMenu.setPosition(80, 100)
    miniMenu.onButtonPressed(MainMenu, miniMenu.Button.A, function (selection, selectedIndex) {
        miniMenu.getMenuItem(MainMenu, 0).setText("Level Select")
        miniMenu.insertMenuItem(MainMenu, miniMenu.createMenuItem("Marathon"), 1)
        MainMenu.setPosition(80, 100)
        miniMenu.onButtonPressed(MainMenu, miniMenu.Button.A, function (selection, selectedIndex) {
            if (selectedIndex == 0) {
                MarathonMode = false
                sprites.destroy(TitleSprite)
                miniMenu.close(MainMenu)
                LevelSelect()
            } else {
                timer.background(function () {
                    for (let value of LevelsDataArray) {
                        if (_1IsInMainMenu) {
                            if (value[0] == 0) {
                                game.showLongText("Beat all main levels to unlock Marathon Mode.", DialogLayout.Bottom)
                                break;
                            }
                            MarathonMode = true
                            sprites.destroy(TitleSprite)
                            miniMenu.close(MainMenu)
                            InitLevel(0)
                            MarathonTimerStart = game.runtime()
                            MarathonTimerSprite = fancyText.create("GO!", 0, fancyText.twoToneColor(4, 2), fancyText.outline_two_tone_12)
                            MarathonTimerSprite.setFlag(SpriteFlag.RelativeToCamera, true)
                        }
                    }
                })
            }
        })
    })
}
scene.onOverlapTile(SpriteKind.BallKind, assets.tile`Goal`, function (sprite, location) {
    if (!(HasBall)) {
        music.play(music.createSoundEffect(WaveShape.Noise, 926, 575, 247, 110, 200, SoundExpressionEffect.Vibrato, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        sprites.destroyAllSpritesOfKind(SpriteKind.BallKind)
        timer.throttle("winga", 3000, function () {
            scene.cameraShake(6, 500)
            LevelsDataArray[CurrentLevel][0] = 1
            SaveGame()
            GoalText = fancyText.create("GOOOOOOOOOOOOAAAALLL!!!", 0, 1, fancyText.rounded_large)
            GoalText.setFlag(SpriteFlag.RelativeToCamera, true)
            GoalText.setPosition(320, 40)
            if (MarathonMode) {
                GoalText.setVelocity(-350, 0)
            } else {
                GoalText.setVelocity(-175, 0)
            }
            timer.background(function () {
                if (MarathonMode) {
                    pause(1000)
                } else {
                    pause(2500)
                }
                GoalText.setFlag(SpriteFlag.AutoDestroy, true)
                sprites.destroyAllSpritesOfKind(SpriteKind.Player)
                tiles.setCurrentTilemap(tilemap`level6`)
                scene.centerCameraAt(80, 60)
                if (MarathonMode) {
                    if (CurrentLevel == LevelsTilemapArray.length - 1) {
                        game.setGameOverMessage(true, "Your time: " + convertToText((game.runtime() - MarathonTimerStart) / 1000) + "s !!")
                        game.gameOver(true)
                    } else {
                        InitLevel(CurrentLevel + 1)
                    }
                } else {
                    TitleScreen()
                }
            })
        })
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.BallKind, function (sprite, otherSprite) {
    if (!(HasBall) && CanGrabBall) {
        HasBall = true
    }
})
function LevelSelect () {
    LevelSelectMenuArray = []
    ReadingIndex = 0
    for (let value of LevelsDataArray) {
        if (ReadingIndex == 0) {
            TempImg = assets.image`Level`.clone()
        } else {
            if (LevelsDataArray[ReadingIndex - 1][0] == 1) {
                TempImg = assets.image`Level`.clone()
            } else {
                TempImg = assets.image`LevelLocked`.clone()
            }
        }
        if (!(TempImg.equals(assets.image`LevelLocked`))) {
            images.print_block(
            convertToText(ReadingIndex + 1),
            TempImg,
            12,
            8,
            images.color_block(12),
            images.font_block(images.Imagefonts.font12)
            )
        }
        for (let index = 0; index <= 2; index++) {
            if (value[index] == 0) {
                TempImg.replace([images.color_block(3), images.color_block(10), images.color_block(2)][index], 11)
            } else {
                TempImg.replace([images.color_block(3), images.color_block(10), images.color_block(2)][index], 5)
            }
        }
        LevelSelectMenuArray.push(miniMenu.createMenuItem("abc", TempImg))
        ReadingIndex += 1
    }
    MainMenu = miniMenu.createMenuFromArray(LevelSelectMenuArray)
    miniMenu.setFrame(MainMenu, assets.image`Frame`)
    miniMenu.setStyleProperty(MainMenu, miniMenu.StyleKind.All, miniMenu.StyleProperty.IconOnly, 1)
    miniMenu.setMenuStyleProperty(MainMenu, miniMenu.MenuStyleProperty.Rows, 3)
    miniMenu.setMenuStyleProperty(MainMenu, miniMenu.MenuStyleProperty.Columns, 3)
    miniMenu.setMenuStyleProperty(MainMenu, miniMenu.MenuStyleProperty.BackgroundColor, images.color_block(3))
    MainMenu.setPosition(80, 60)
    miniMenu.onButtonPressed(MainMenu, miniMenu.Button.A, function (selection, selectedIndex) {
        if (DevLevelCheese || !(miniMenu.getMenuItem(MainMenu, selectedIndex).getIcon().equals(assets.image`LevelLocked`))) {
            miniMenu.close(MainMenu)
            InitLevel(selectedIndex)
        } else {
            scene.cameraShake(4, 500)
        }
    })
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`Checkpoint0`, function (sprite, location) {
    tileUtil.replaceAllTiles(assets.tile`Checkpoint`, assets.tile`Checkpoint0`)
    tiles.setTileAt(location, assets.tile`Checkpoint`)
    if (HasBall) {
        sprite.startEffect(effects.confetti, 500)
        music.play(music.stringPlayable("E E G G C5 C5 C5 C5 ", 1000), music.PlaybackMode.InBackground)
    }
})
scene.onHitWall(SpriteKind.BallKind, function (sprite, location) {
    if (!(HasBall)) {
        if (arrays.includes(BreakableArray, tiles.tileImageAtLocation(location))) {
            tiles.setTileAt(location, assets.tile`transparency16`)
            tiles.setWallAt(location, false)
            scene.cameraShake(4, 200)
        }
        if (sprite.y < location.y && location.y - sprite.y < 12 || sprite.y > location.y && sprite.y - location.y < 12) {
            music.play(music.createSoundEffect(WaveShape.Noise, 1541, 1, 222, 209, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            sprite.vx = sprite.vx * -1 / 3
            scene.cameraShake(4, 200)
        }
    }
})
function BordersAutotile (BaseBlock: Image[], Tiles: Image[]) {
    let myTilemap = 0
    tileUtil.setWalls(BaseBlock[0], true)
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Top, tileScanner.LogicOp.And, CollisionDirection.Right)))), Tiles[1])
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Top, tileScanner.LogicOp.And, CollisionDirection.Left)))), ToMirroredImage(Tiles[1]))
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Top)))), Tiles[0])
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Right)))), Tiles[2])
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Left)))), ToMirroredImage(Tiles[2]))
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Bottom, tileScanner.LogicOp.And, CollisionDirection.Right)))), Tiles[3])
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Bottom, tileScanner.LogicOp.And, CollisionDirection.Left)))), ToMirroredImage(Tiles[3]))
    tileScanner.setTileAtLocations(tileScanner.getAllMatchingLocations(tileScanner.and(tileScanner.tileIs(BaseBlock[0]), tileScanner.bordersSides(tileScanner.not(tileScanner.isWall()), tileScanner.sideGroups(CollisionDirection.Bottom)))), images.rotate_image_block(Tiles[2], 90))
}
browserEvents.Q.onEvent(browserEvents.KeyEvent.Pressed, function () {
    if (!(_1IsInMainMenu)) {
        UpKick()
    }
})
browserEvents.S.onEvent(browserEvents.KeyEvent.Pressed, function () {
    if (!(_1IsInMainMenu)) {
        DownKick()
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(_1IsInMainMenu)) {
        FacingRight = true
    }
})
function SaveGame () {
    blockSettings.writeNumberArray("SaveLevelsData", arrays.concatMany(LevelsDataArray))
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(_1IsInMainMenu)) {
        FacingRight = false
    }
})
multiEvents.onOverlapTile(multiEvents.spriteKinds(SpriteKind.Player, SpriteKind.BallKind), multiEvents.tileList(assets.tile`Button`, assets.tile`Button1`), function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`Button`)) {
        tiles.setTileAt(location, assets.tile`Button0`)
    } else {
        tiles.setTileAt(location, assets.tile`Button2`)
    }
    tileUtil.setWalls(assets.tile`ButtonTile`, false)
    tileUtil.replaceAllTiles(assets.tile`ButtonTile`, assets.tile`transparency16`)
})
multiEvents.onOverlapTile(multiEvents.spriteKinds(SpriteKind.Player), multiEvents.tileList(assets.tile`Coin1`, assets.tile`Coin2`), function (sprite, location) {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    if (tiles.tileAtLocationEquals(location, assets.tile`Coin1`)) {
        LevelsDataArray[CurrentLevel][1] = 1
    } else {
        LevelsDataArray[CurrentLevel][2] = 1
    }
    tiles.setTileAt(location, assets.tile`transparency16`)
    if (MarathonMode) {
        MarathonTimerStart += 2500
        fancyText.setColor(MarathonTimerSprite, fancyText.twoToneColor(2, 14))
        timer.after(500, function () {
            fancyText.setColor(MarathonTimerSprite, fancyText.twoToneColor(4, 2))
        })
    }
})
function Animations () {
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogIdle`],
    500,
    characterAnimations.rule(Predicate.NotMoving, Predicate.FacingRight)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogIdle0`],
    500,
    characterAnimations.rule(Predicate.NotMoving, Predicate.FacingLeft)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogWalk`, assets.image`FrogWalk0`],
    250,
    characterAnimations.rule(Predicate.MovingRight, Predicate.HittingWallDown)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogWalk1`, assets.image`FrogWalk2`],
    250,
    characterAnimations.rule(Predicate.MovingLeft, Predicate.HittingWallDown)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogJump`],
    250,
    characterAnimations.rule(Predicate.MovingUp, Predicate.FacingRight)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogJump0`],
    250,
    characterAnimations.rule(Predicate.MovingUp, Predicate.FacingLeft)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogJump1`],
    250,
    characterAnimations.rule(Predicate.MovingDown, Predicate.FacingRight)
    )
    characterAnimations.loopFrames(
    Player,
    [assets.image`FrogJump2`],
    250,
    characterAnimations.rule(Predicate.MovingDown, Predicate.FacingLeft)
    )
}
function LoadSave () {
    Levels()
}
function DefineLevel (Index: number) {
    if (blockSettings.exists("SaveLevelsData")) {
        if (LevelsTilemapArray.length * 3 == blockSettings.readNumberArray("SaveLevelsData").length) {
            LevelsDataArray.push(arrays.toSliced(arrays.concatMany([blockSettings.readNumberArray("SaveLevelsData"), [0]]), Index * 3, Index * 3 + 3))
        } else {
            game.showLongText("Save data does not match levels ammount. Your data will be reset.", DialogLayout.Bottom)
            blockSettings.clear()
            game.reset()
        }
    } else {
        LevelsDataArray.push([0, 0, 0])
    }
}
function UpKick () {
    if (HasBall) {
        music.play(music.createSoundEffect(WaveShape.Noise, 3311, 712, 137, 128, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        CanGrabBall = false
        HasBall = false
        Ball.setFlag(SpriteFlag.Ghost, false)
        if (tiles.tileAtLocationIsWall(Ball.tilemapLocation())) {
            scene.cameraShake(5, 200)
            HasBall = true
        } else {
            Ball.vy = -225 + Player.vy / 2
            Ball.vx = Player.vx
            scene.cameraShake(3, 200)
            timer.after(250, function () {
                CanGrabBall = true
            })
        }
    }
}
function InitLevel (LevelNum: number) {
    _1IsInMainMenu = false
    CurrentLevel = LevelNum
    tiles.setCurrentTilemap(LevelsTilemapArray[LevelNum])
    scene.setBackgroundColor(10)
    if (LevelNum == 0) {
        scene.setBackgroundColor(13)
    }
    Player = sprites.create(assets.image`FrogIdle`, SpriteKind.Player)
    controller.moveSprite(Player, 140, 0)
    scene.cameraFollowSprite(Player)
    Ball = sprites.create(assets.image`Ball`, SpriteKind.BallKind)
    Player.ay = 400
    Player.fx = 100
    FacingRight = true
    HasBall = true
    CanGrabBall = true
    CanMove = true
    Ball.fx = 75
    Animations()
    BordersAutotile([assets.tile`Dirt`], [
    assets.tile`Grass`,
    assets.tile`Grass0`,
    assets.tile`Dirt0`,
    assets.tile`Dirt1`
    ])
    BordersAutotile([assets.tile`Blank`], [
    assets.tile`BlankTop`,
    assets.tile`BlankEdge`,
    assets.tile`Blank0`,
    assets.tile`Blank1`
    ])
    for (let value of multiEvents.getTilesByType(multiEvents.tileList(assets.tile`BLUE TESTING BOX OF DOOM`, assets.tile`Can Break`, assets.tile`BlankOne`, assets.tile`ButtonTile`))) {
        tiles.setWallAt(value, true)
    }
    tiles.placeOnRandomTile(Player, assets.tile`Checkpoint`)
    Player.y += -4
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (_1IsInMainMenu) {
    	
    } else {
        if (HasBall) {
            music.play(music.createSoundEffect(WaveShape.Noise, 3311, 712, 137, 128, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            CanGrabBall = false
            HasBall = false
            Ball.setFlag(SpriteFlag.Ghost, false)
            if (tiles.tileAtLocationIsWall(Ball.tilemapLocation())) {
                scene.cameraShake(5, 200)
                HasBall = true
            } else {
                if (controller.down.isPressed() && !(Player.isHittingTile(CollisionDirection.Bottom))) {
                    Ball.vy = 150
                    Ball.vx = Player.vx
                    Player.vy = -175
                    scene.cameraShake(4, 200)
                } else if (controller.up.isPressed()) {
                    Ball.vy = -225 + Player.vy / 2
                    Ball.vx = Player.vx
                    scene.cameraShake(3, 200)
                } else {
                    if (FacingRight) {
                        Ball.vx = 150 + Player.vx
                    } else {
                        Ball.vx = -150 + Player.vx
                    }
                }
                timer.after(250, function () {
                    CanGrabBall = true
                })
            }
        }
    }
})
let CanMove = false
let FacingRight = false
let LevelSelectMenuArray: miniMenu.MenuItem[] = []
let GoalText: fancyText.TextSprite = null
let CurrentLevel = 0
let MarathonTimerSprite: fancyText.TextSprite = null
let MarathonTimerStart = 0
let MarathonMode = false
let MainMenu: Sprite = null
let TitleSprite: Sprite = null
let Ball: Sprite = null
let CanGrabBall = false
let Player: Sprite = null
let TempImg: Image = null
let ReadingIndex = 0
let LevelsTilemapArray: tiles.TileMapData[] = []
let LevelsDataArray: number[][] = []
let HasBall = false
let BreakableArray: Image[] = []
let _1IsInMainMenu = false
let DevLevelCheese = false
DevLevelCheese = false
if (false) {
    blockSettings.clear()
}
game.setDialogFrame(assets.image`Frame`)
_1IsInMainMenu = true
BreakableArray = [assets.tile`Can Break`]
TitleScreen()
game.onUpdateInterval(50, function () {
    if (!(_1IsInMainMenu) && MarathonMode) {
        fancyText.setText(MarathonTimerSprite, convertToText((game.runtime() - MarathonTimerStart) / 1000))
        MarathonTimerSprite.setPosition(80, 8)
    }
})
game.onUpdate(function () {
    if (!(_1IsInMainMenu)) {
        if (HasBall) {
            Ball.ay = 0
            Ball.vy = 0
            if (FacingRight) {
                Ball.setPosition(Player.x + 3, Player.y + 6)
            } else {
                Ball.setPosition(Player.x - 3, Player.y + 6)
            }
        } else {
            Ball.ay = 400
        }
    }
})
