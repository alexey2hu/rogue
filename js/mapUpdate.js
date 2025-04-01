// Класс для обновления и вывода карты
class MapUpdate {
	constructor(gameMap) {
		this.gameMap = gameMap
		this.tileSize = this.gameMap.tileSize
		this.field = document.querySelector('.field') // Кэшируем ссылку на поле
	}

	// Метод для получения координат всех объектов указанного типа
	findObjectCoordinates(tileType) {
		const coordinates = []
		for (let y = 0; y < this.gameMap.height; y++) {
			for (let x = 0; x < this.gameMap.width; x++) {
				if (this.gameMap.grid[y][x].startsWith(tileType)) {
					coordinates.push({ x, y })
				}
			}
		}
		return coordinates.length > 0 ? coordinates : null
	}

	// Добавляем полоску здоровья к персонажу или врагу
	addHealthBar(tile, health = 100) {
		if (!tile.querySelector('.health')) {
			const healthBar = document.createElement('div')
			healthBar.className = 'health'
			healthBar.style.width = `${health}%`
			tile.appendChild(healthBar)
		}
	}

	// Удаляем полоску здоровья
	removeHealthBar(x, y) {
		const tile = this.field.children[y * this.gameMap.width + x]
		const healthBar = tile?.querySelector('.health')
		if (healthBar) tile.removeChild(healthBar)
	}

	// Метод для отрисовки карты на экране
	render() {
		// Очистка поля перед отрисовкой
		this.field.innerHTML = ''

		// Установка размеров поля
		this.field.style.width = `${this.gameMap.width * this.tileSize}px`
		this.field.style.height = `${this.gameMap.height * this.tileSize}px`

		// Используем фрагмент для массового добавления тайлов
		const fragment = document.createDocumentFragment()
		for (let y = 0; y < this.gameMap.height; y++) {
			for (let x = 0; x < this.gameMap.width; x++) {
				const tile = this.createTile(x, y)
				fragment.appendChild(tile)
			}
		}
		this.field.appendChild(fragment) // Добавляем все тайлы одним действием
	}

	// Обновление конкретного тайла
	updateTile(x, y) {
		const tile = this.field.children[y * this.gameMap.width + x]
		if (tile) {
			tile.className = 'tile' // Всегда класс "tile"
			const tileType = this.gameMap.grid[y][x]
			if (tileType) {
				tile.classList.add(tileType) // Добавляем тип тайла как класс
			}
		}
	}

	// Создание тайла
	createTile(x, y) {
		const tile = document.createElement('div')
		tile.className = 'tile' // Класс всегда "tile"
		const tileType = this.gameMap.grid[y][x]
		if (tileType) {
			tile.classList.add(tileType) // Добавляем тип как дополнительный класс
		}
		tile.style.position = 'absolute'
		tile.style.width = `${this.tileSize}px`
		tile.style.height = `${this.tileSize}px`
		tile.style.top = `${y * this.tileSize}px`
		tile.style.left = `${x * this.tileSize}px`
		tile.dataset.x = x
		tile.dataset.y = y
		return tile
	}
}

window.MapUpdate = MapUpdate
