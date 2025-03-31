class Utils {
	// Метод для обновления отображения здоровья
	static updateHealthDisplay(type, x, y, health) {
		const healthBar = `<div class='health' style='width: ${health}%;'></div>`
		const tileElement = document.querySelector(
			`.${type}[data-x='${x}'][data-y='${y}']`
		)
		if (tileElement) tileElement.innerHTML = healthBar

		// Если обновляется здоровье игрока, обновляем и счётчик на экране
		if (type === 'tile-P') {
			const healthCountElement = document.getElementById('HP-count')
			if (healthCountElement) healthCountElement.textContent = `${health}%`
		}
	}

	// Метод для передвижения
	static moveRandom(type) {
		const { x, y } = this.position

		let directions = [
			{ dx: 0, dy: -1 }, // вверх
			{ dx: -1, dy: 0 }, // влево
			{ dx: 0, dy: 1 }, // вниз
			{ dx: 1, dy: 0 }, // вправо
		]

		const direction = directions[Math.floor(Math.random() * directions.length)]

		// Проверка по типу
		if (this.gameMap.grid[y][x] === 'tile-E') {
			// Если враг
		} else if (this.gameMap.grid[y][x] === 'tile-P') {
			// Если игрок
		}

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
				Utils.takeDamage(player, this.attackPower)
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

	// Метод для получения урона
	static takeDamage(target, damage) {
		// Уменьшаем здоровье, не позволяя ему стать отрицательным
		target.health = Math.max(target.health - damage, 0)

		// Определяем координаты в зависимости от наличия метода получения позиции
		const position =
			typeof target.getObjectPosition === 'function'
				? target.getObjectPosition(target.tileType)
				: target.position

		// Если координаты найдены, обновляем отображение здоровья
		if (position) {
			const { x, y } = position
			Utils.updateHealthDisplay(target.tileType, x, y, target.health)

			// Если здоровье достигло нуля, вызываем метод смерти
			if (target.health === 0) {
				Utils.die(target, x, y)
			}
		}
	}

	// Метод для обработки смерти
	static die(target, x, y) {
		// Удаляем полоску здоровья
		if (target.mapUpdate) target.mapUpdate.removeHealthBar(x, y)

		// Заменяем тайл на пустой
		target.gameMap.grid[y][x] = 'tile-'
		if (target.mapUpdate) target.mapUpdate.updateTile(x, y) // Обновляем визуально

		// Если это игрок, выводим сообщение
		if (target.tileType === 'tile-P') {
			alert('Вы проиграли! Игра окончена.')
		}
	}
}

export default Utils
