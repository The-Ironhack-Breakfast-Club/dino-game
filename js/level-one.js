function levelOne() {
    let floor1 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 0, height - 128, 128, 128)
    let floor2 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128, height - 128, 128, 128)
    let floor3 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 2, height - 128, 128, 128)
    let floor4 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 3, height - 128, 128, 128)
    let floor5 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 4, height - 128, 128, 128)
    let floor6 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 5, height - 128, 128, 128)
    let floor7 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 6, height - 128, 128, 128)
    let floor8 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 7, height - 128, 128, 128)
    let floor9 = new Terrain(tileSprite, 128 * 1, 0, 128, 128, 128 * 8, height - 128, 128, 128)
}

export { levelOne };