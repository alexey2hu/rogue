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
				this.die(target, x, y)
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
