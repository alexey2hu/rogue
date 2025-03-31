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
			this.updateHealthDisplay(x, y)
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

	// Метод для обновления отображения здоровья на карте
	updateHealthDisplay(x, y) {
		const healthBar = `<div class='health' style='width: ${this.health}%;'></div>`
		const healthCountElement = document.getElementById('HP-count')
		const tileElement = document.querySelector(
			`.tile-P[data-x='${x}'][data-y='${y}']`
		)
		tileElement.innerHTML = healthBar
		healthCountElement.textContent = `${this.health}%`
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
			{ dx: 0, dy: -1 }, // вверх
			{ dx: -1, dy: 0 }, // влево
			{ dx: 0, dy: 1 }, // вниз
			{ dx: 1, dy: 0 }, // вправо
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
					if (enemy) {
						enemy.takeDamage(this.attackPower)
						console.log(`Враг на клетке (${targetX}, ${targetY}) атакован!`)
					}
				}
			}
		})
	}

	// Метод для получения урона
	takeDamage(damage) {
		this.health = Math.max(this.health - damage, 0)

		// Обновляем здоровье на карте
		const position = this.getObjectPosition(this.tileType)
		if (position) {
			const { x, y } = position
			this.updateHealthDisplay(x, y)

			// Если здоровье закончилось — игрок умирает
			if (this.health === 0) {
				this.die()
			}
		}
	}

	// Метод для восстановления здоровья
	restoreHealth(amount) {
		this.health = Math.min(this.health + amount, 100)
		this.updateHealthDisplay(x, y) // Обновляем здоровье в интерфейсе
	}

	// Метод для обработки смерти игрока
	die() {
		console.log('Игрок погиб! Игра окончена.')
		alert('Вы проиграли! Игра окончена.')
	}

	// Метод для перемещения игрока
	move(direction) {
		const position = this.getObjectPosition(this.tileType)
		if (!position) return // Если игрок не найден, выходим из метода

		const { x, y } = position
		const newX = x + direction.dx
		const newY = y + direction.dy
		// Проверка, не выходит ли персонаж за пределы карты
		if (
			newX >= 0 &&
			newX < this.gameMap.width &&
			newY >= 0 &&
			newY < this.gameMap.height
		) {
			// Проверяем, что клетка не является стеной или врагом
			const targetTile = this.gameMap.grid[newY][newX]
			if (targetTile !== 'tile-W' && targetTile !== 'tile-E') {
				// Взаимодействие с плитками
				if (targetTile === 'tile-HP') {
					this.health = Math.min(this.health + 20, 100) // Восстанавливаем здоровье
				} else if (targetTile === 'tile-SW') {
					this.attackPower += 10 // Увеличиваем силу атаки
					this.updateAttackPowerDisplay() // Обновляем отображение урона
				}

				// Удаляем старую полоску здоровья, если она существует
				this.mapUpdate.removeHealthBar(x, y)
				this.gameMap.grid[y][x] = 'tile-' // Освобождаем старую позицию

				// Новая позиция для игрока
				this.gameMap.grid[newY][newX] = this.tileType
				// Обновляем отображение карты
				this.mapUpdate.updateTile(newX, newY)
				this.mapUpdate.updateTile(x, y) // Обновляем старую позицию

				// Обновляем отображение здоровья
				this.updateHealthDisplay(newX, newY)

				// Добавляем полоску здоровья
				const tileElement = document.querySelector(
					`.tile-P[data-x='${newX}'][data-y='${newY}']`
				)
				if (tileElement) {
					this.mapUpdate.addHealthBar(tileElement, this.health)
				}
			}
		}
	}
}

export default Player
