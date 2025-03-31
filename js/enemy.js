import Utils from './utils.js'

class Enemy {
	static enemies = [] // Статический массив врагов

	constructor(gameMap, mapUpdate, id, initialPosition) {
		this.gameMap = gameMap
		this.mapUpdate = mapUpdate
		this.tileType = `tile-E`
		this.health = 100
		this.attackPower = 10
		this.id = id
		this.position = initialPosition
		Utils.updateHealthDisplay(
			this.tileType,
			this.position.x,
			this.position.y,
			this.health
		)
		Enemy.enemies.push(this) // Добавляем врага в статический массив
	}

	// Метод для атаки
	attack(player) {
		player.takeDamage(this.attackPower)
	}

	// Метод для получения текущих координат врага
	getPosition() {
		return this.position
	}

	// Метод для обновления позиции врага
	updatePosition(newX, newY) {
		this.position = { x: newX, y: newY }
	}

	// Метод для случайного движения врага с приоритетом в сторону игрока
	moveRandom(player) {
		const { x, y } = this.position

		// Проверка, что текущая клетка - это 'tile-E', иначе враг мертв
		if (this.gameMap.grid[y][x] !== 'tile-E') {
			console.log(`Враг ${this.id} мертв, движение невозможно.`)
			return
		}

		let directions = [
			{ dx: 0, dy: -1 }, // вверх
			{ dx: -1, dy: 0 }, // влево
			{ dx: 0, dy: 1 }, // вниз
			{ dx: 1, dy: 0 }, // вправо
		]

		// Определяем направление к игроку
		const playerPosition = player.getObjectPosition('tile-P')
		if (playerPosition) {
			const dx = playerPosition.x - x
			const dy = playerPosition.y - y

			if (Math.abs(dx) > Math.abs(dy)) {
				if (dx > 0) directions = [{ dx: 1, dy: 0 }, ...directions]
				else directions = [{ dx: -1, dy: 0 }, ...directions]
			} else {
				if (dy > 0) directions = [{ dx: 0, dy: 1 }, ...directions]
				else directions = [{ dx: 0, dy: -1 }, ...directions]
			}
		}

		const direction = directions[Math.floor(Math.random() * directions.length)]
		const newX = x + direction.dx
		const newY = y + direction.dy

		if (
			newX >= 0 &&
			newX < this.gameMap.width &&
			newY >= 0 &&
			newY < this.gameMap.height
		) {
			const targetTile = this.gameMap.grid[newY][newX]

			// Если на новой клетке игрок — атакуем, но не двигаемся
			if (targetTile === 'tile-P') {
				this.attack(player) // Передаем игрока в метод атаки
				return
			}

			if (
				targetTile !== 'tile-W' &&
				targetTile !== 'tile-E' &&
				targetTile !== 'tile-HP' &&
				targetTile !== 'tile-SW'
			) {
				this.mapUpdate.removeHealthBar(x, y)
				this.gameMap.grid[y][x] = 'tile-'
				this.gameMap.grid[newY][newX] = this.tileType
				this.updatePosition(newX, newY)
				this.mapUpdate.updateTile(newX, newY)
				this.mapUpdate.updateTile(x, y)
				Utils.updateHealthDisplay(this.tileType, newX, newY, this.health)
				console.log(`Враг ${this.id} успешно переместился в (${newX}, ${newY})`)
			}
		}
	}

	// Метод для получения информации о текущем здоровье
	getHealth() {
		return this.health
	}

	// Метод для уменьшения здоровья врага
	takeDamage(damage) {
		this.health = Math.max(this.health - damage, 0)
		Utils.updateHealthDisplay(
			this.tileType,
			this.position.x,
			this.position.y,
			this.health
		)

		if (this.health === 0) {
			this.die()
		}
	}

	die() {
		const { x, y } = this.position
		this.mapUpdate.removeHealthBar(x, y)
		this.gameMap.grid[y][x] = 'tile-' // Заменяем тайл на пустой
		this.mapUpdate.updateTile(x, y) // Обновляем визуально

		// Удаляем врага из статического массива
		Enemy.enemies = Enemy.enemies.filter(enemy => enemy.id !== this.id)
	}
}

export default Enemy
