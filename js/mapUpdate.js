// Класс для обновления и вывода карты
class MapUpdate {
	constructor(gameMap) {
		this.gameMap = gameMap // Ссылка на объект карты
		this.tileSize = this.gameMap.tileSize // Размер тайлов
	}

	// Метод для получения координат всех объектов указанного типа
	findObjectCoordinates(tileType) {
		const coordinates = [] // Массив для хранения координат объектов

		// Проходим по всей карте и ищем все объекты указанного типа
		for (let y = 0; y < this.gameMap.height; y++) {
			for (let x = 0; x < this.gameMap.width; x++) {
				const tile = this.gameMap.grid[y][x]
				if (tile.startsWith(tileType)) {
					// Проверяем, начинается ли строка с нужного типа
					coordinates.push({ x, y }) // Добавляем координаты объекта в массив
				}
			}
		}
		// Возвращаем массив координат всех найденных объектов
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

	// Добавляем метод для удаления полоски здоровья
	removeHealthBar(x, y) {
		const field = document.querySelector('.field')
		const tile = field.children[y * this.gameMap.width + x] // Находим соответствующий тайл
		const healthBar = tile.querySelector('.health')
		if (healthBar) {
			tile.removeChild(healthBar) // Удаляем полоску здоровья
		}
	}

	// Метод для отрисовки карты на экране
	render() {
		const field = document.querySelector('.field')
		field.innerHTML = '' // Очистка поля
		field.style.width = `${this.gameMap.width * this.tileSize}px`
		field.style.height = `${this.gameMap.height * this.tileSize}px`

		// Отрисовка каждого тайла на карте
		for (let y = 0; y < this.gameMap.height; y++) {
			for (let x = 0; x < this.gameMap.width; x++) {
				this.createTile(x, y)
			}
		}
	}

	// Метод для обновления конкретного тайла
	updateTile(x, y) {
		const field = document.querySelector('.field')
		const tile = field.children[y * this.gameMap.width + x] // Находим соответствующий тайл
		tile.className = 'tile ' + this.gameMap.grid[y][x] // Обновляем класс тайла
	}

	// Метод для создания нового тайла
	createTile(x, y) {
		const field = document.querySelector('.field')
		const tile = document.createElement('div')
		tile.classList.add('tile', this.gameMap.grid[y][x])
		tile.style.position = 'absolute'
		tile.style.width = `${this.tileSize}px`
		tile.style.height = `${this.tileSize}px`
		tile.style.top = `${y * this.tileSize}px`
		tile.style.left = `${x * this.tileSize}px`
		tile.setAttribute('data-x', x) // Добавляем атрибут x
		tile.setAttribute('data-y', y) // Добавляем атрибут y

		field.appendChild(tile) // Добавляем тайл на поле
	}
}

export default MapUpdate
