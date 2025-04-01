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

	// Метод для передвижения объекта
	static moveObject(target, direction, player = null) {
		const { x, y } =
			target.position || target.getObjectPosition(target.tileType)
		const newX = x + direction.dx
		const newY = y + direction.dy

		// Проверка на смерть
		if (target.health === 0) {
			return
		}

		// Проверяем границы карты
		if (
			newX >= 0 &&
			newX < target.gameMap.width &&
			newY >= 0 &&
			newY < target.gameMap.height
		) {
			const targetTile = target.gameMap.grid[newY][newX]

			// Обработка столкновения с игроком для врага
			if (targetTile === 'tile-P' && target.tileType === 'tile-E') {
				if (player) Utils.takeDamage(player, target.attackPower)
				return
			}

			// Проверяем препятствия
			if (
				targetTile !== 'tile-W' &&
				targetTile !== 'tile-E' &&
				!(targetTile === 'tile-HP' && target.tileType === 'tile-E') &&
				!(targetTile === 'tile-SW' && target.tileType === 'tile-E')
			) {
				// Обработка бонусов игрока
				if (targetTile === 'tile-HP' && target.tileType === 'tile-P') {
					target.restoreHealth(20)
				} else if (targetTile === 'tile-SW' && target.tileType === 'tile-P') {
					target.attackPower += 10
					target.updateAttackPowerDisplay()
				}

				// Удаляем старую полоску здоровья и обновляем карту
				target.mapUpdate.removeHealthBar(x, y)
				target.gameMap.grid[y][x] = 'tile-' // Очистка старой ячейки

				// Перемещаем врага на новую позицию
				target.position = { x: newX, y: newY }
				target.gameMap.grid[newY][newX] = target.tileType

				// Обновляем визуально
				target.mapUpdate.updateTile(newX, newY)
				target.mapUpdate.updateTile(x, y)
				Utils.updateHealthDisplay(target.tileType, newX, newY, target.health)

				// Добавляем полоску здоровья для игрока
				if (target.tileType === 'tile-P') {
					const tileElement = document.querySelector(
						`.tile-P[data-x='${newX}'][data-y='${newY}']`
					)
					if (tileElement) {
						target.mapUpdate.addHealthBar(tileElement, target.health)
					}
				}
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
			} else {
				// Находим тайл по координатам
				const field = document.querySelector('.field')
				const tile = field.querySelector(`[data-x="${x}"][data-y="${y}"]`)

				// Создаем элемент для анимации удара
				if (tile) {
					const hitElement = document.createElement('div')
					hitElement.classList.add('hit-animation')
					tile.appendChild(hitElement) // Добавляем элемент для анимации на тайл

					// Удаляем элемент после завершения анимации (500ms)
					setTimeout(() => {
						tile.removeChild(hitElement) // Убираем элемент из DOM
					}, 100)
				}
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

window.Utils = Utils
