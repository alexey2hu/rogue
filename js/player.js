class Player {
	constructor(gameMap, mapUpdate, enemies) {
		this.gameMap = gameMap // Ссылка на объект карты
		this.mapUpdate = mapUpdate // Ссылка на объект обновления карты
		this.enemies = enemies // Ссылка на массив врагов
		this.tileType = 'tile-P' // Тип тайла для персонажа
		this.health = 100 // Начальное здоровье игрока
		this.attackPower = 30 // Сила атаки
	}

	// Инициализация игрока с отображением полоски здоровья
	init() {
		const position = this.getObjectPosition(this.tileType)
		if (position) {
			const { x, y } = position
			Utils.updateHealthDisplay(this.tileType, x, y, this.health)
			const tileElement = document.querySelector(
				`.tile-P[data-x='${x}'][data-y='${y}']`
			)
			if (tileElement) {
				this.mapUpdate.addHealthBar(tileElement, this.health)
			}
		}
	}

	// Метод для получения текущих координат объекта по его типу
	getObjectPosition(tileType) {
		const position = this.mapUpdate.findObjectCoordinates(tileType)
		return position && position.length > 0 ? position[0] : null
	}

	// Метод для обновления урона в инвентаре
	updateAttackPowerDisplay() {
		const attackPowerElement = document.getElementById('sword-count')
		if (attackPowerElement)
			attackPowerElement.textContent = `${this.attackPower}`
	}

	// Метод для атаки врагов рядом с игроком
	attack() {
		const position = this.getObjectPosition(this.tileType)
		if (!position) return

		const { x, y } = position
		const directions = [
			{ dx: 0, dy: -1 },
			{ dx: -1, dy: 0 },
			{ dx: 0, dy: 1 },
			{ dx: 1, dy: 0 },
		]

		directions.forEach(direction => {
			const targetX = x + direction.dx
			const targetY = y + direction.dy

			if (
				targetX >= 0 &&
				targetX < this.gameMap.width &&
				targetY >= 0 &&
				targetY < this.gameMap.height
			) {
				const targetTile = this.gameMap.grid[targetY][targetX]
				if (targetTile.startsWith('tile-E')) {
					const enemy = this.enemies.find(
						enemy =>
							enemy.getPosition().x === targetX &&
							enemy.getPosition().y === targetY
					)
					// Атака врага
					if (enemy) {
						Utils.takeDamage(enemy, this.attackPower)
					}
				}
			}
		})
	}

	// Метод для восстановления здоровья
	restoreHealth(amount) {
		this.health = Math.min(this.health + amount, 100)
		const position = this.getObjectPosition(this.tileType)
		if (position) {
			const { x, y } = position
			Utils.updateHealthDisplay(this.tileType, x, y, this.health)
		}
	}

	// Метод для перемещения игрока
	move(direction) {
		Utils.moveObject(this, direction)
	}
}

window.Player = Player
