console.log('map class loaded')

// Класс для генерации и отображения карты
class Map {
	constructor() {
		this.width = 40 // Ширина карты в тайлах
		this.height = 24 // Высота карты в тайлах
		this.tileSize = 25 // Размер одного тайла в пикселях
		this.grid = [] // Массив, представляющий карту
	}

	// Метод для инициализации карты
	init() {
		do {
			this.generateWalls() // Заполняем карту стенами
			this.generateRooms() // Генерируем комнаты
			this.generatePassages() // Создаем проходы между комнатами
		} while (!this.isAllConnected()) // Если не все 'tile-' клетки связаны, генерируем карту заново
		this.placeObjects() // Размещаем объекты
	}

	// Метод для заполнения карты стенами
	generateWalls() {
		this.grid = Array.from({ length: this.height }, () =>
			Array(this.width).fill('tile-W')
		)
	}

	// Метод для генерации случайных комнат
	generateRooms() {
		const roomCount = Math.floor(Math.random() * 6) + 5 // От 5 до 10 комнат
		const padding = 1 // Минимальное расстояние между комнатами

		for (let i = 0; i < roomCount; i++) {
			let roomWidth = Math.floor(Math.random() * 6) + 3
			let roomHeight = Math.floor(Math.random() * 6) + 3
			let startX = Math.floor(Math.random() * (this.width - roomWidth))
			let startY = Math.floor(Math.random() * (this.height - roomHeight))

			// Проверка на пересечение и создание комнаты
			let overlap = false
			for (let y = startY - padding; y < startY + roomHeight + padding; y++) {
				for (let x = startX - padding; x < startX + roomWidth + padding; x++) {
					if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
						if (this.grid[y][x] !== 'tile-W') {
							overlap = true
							break
						}
					}
				}
				if (overlap) break
			}

			// Если не пересекается, создаём комнату
			if (!overlap) {
				for (let y = startY; y < startY + roomHeight; y++) {
					for (let x = startX; x < startX + roomWidth; x++) {
						this.grid[y][x] = 'tile-' // Пустое место
					}
				}
			}
		}
	}

	// Метод для генерации проходов
	generatePassages() {
		const passageTypes = ['vertical', 'horizontal'] // Типы проходов

		passageTypes.forEach(type => {
			const passageCount = Math.floor(Math.random() * 3) + 3 // От 3 до 5 проходов
			const padding = 2 // Отступ от краёв карты
			const minDistance = 2 // Минимальное расстояние между проходами
			const passages = []

			for (let i = 0; i < passageCount; i++) {
				let startCoordinate

				// Генерация случайной координаты для прохода
				do {
					startCoordinate =
						Math.floor(
							Math.random() *
								(type === 'vertical'
									? this.width - 2 * padding
									: this.height - 2 * padding)
						) + padding
				} while (
					passages.some(
						coordinate => Math.abs(coordinate - startCoordinate) < minDistance
					)
				)

				passages.push(startCoordinate) // Добавляем координату в массив

				// Создание прохода
				for (
					let j = 0;
					j < (type === 'vertical' ? this.height : this.width);
					j++
				) {
					if (type === 'vertical') {
						this.grid[j][startCoordinate] = 'tile-' // Вертикальный проход
					} else {
						this.grid[startCoordinate][j] = 'tile-' // Горизонтальный проход
					}
				}
			}
		})
	}

	// Метод для поиска случайных пустых позиций на карте
	getRandomEmptyPosition() {
		let x, y
		do {
			x = Math.floor(Math.random() * this.width)
			y = Math.floor(Math.random() * this.height)
		} while (this.grid[y][x] !== 'tile-') // Пока не найдём пустую клетку
		return { x, y } // Возвращаем координаты
	}

	// Метод для размещения всех объектов на карте (включая героя и врагов)
	placeObjects() {
		// Массив объектов с их типами и количеством
		const items = [
			{ tileType: 'tile-SW', count: 2 },
			{ tileType: 'tile-HP', count: 10 },
			{ tileType: 'tile-E', count: 10 },
			{ tileType: 'tile-P', count: 1 }, // Герой добавляется как обычный объект
		]

		// Проходим по всем объектам и размещаем их
		items.forEach(item => {
			for (let i = 0; i < item.count; i++) {
				const { x, y } = this.getRandomEmptyPosition()
				this.grid[y][x] = item.tileType
			}
		})
	}

	// Метод для получения всех координат объектов на карте
	getAllObjectCoordinates() {
		const coordinates = []
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.grid[y][x].startsWith('tile-')) {
					coordinates.push({ x, y, tile: this.grid[y][x] })
				}
			}
		}
		return coordinates
	}

	// Метод для проверки связности всех клеток типа 'tile-'
	isAllConnected() {
		const visited = Array.from({ length: this.height }, () =>
			Array(this.width).fill(false)
		)

		// Находим первую пустую клетку 'tile-'
		let startX = -1,
			startY = -1
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.grid[y][x] === 'tile-') {
					startX = x
					startY = y
					break
				}
			}
			if (startX !== -1) break
		}

		// Если нет пустых клеток, возвращаем true (все клетки связаны)
		if (startX === -1) return true

		// DFS или BFS для проверки связности
		const stack = [{ x: startX, y: startY }]
		const directions = [
			{ dx: 0, dy: 1 }, // Вниз
			{ dx: 0, dy: -1 }, // Вверх
			{ dx: 1, dy: 0 }, // Вправо
			{ dx: -1, dy: 0 }, // Влево
		]

		visited[startY][startX] = true

		while (stack.length > 0) {
			const { x, y } = stack.pop()

			// Для каждой соседней клетки
			for (const { dx, dy } of directions) {
				const nx = x + dx
				const ny = y + dy

				if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
					if (!visited[ny][nx] && this.grid[ny][nx] === 'tile-') {
						visited[ny][nx] = true
						stack.push({ x: nx, y: ny })
					}
				}
			}
		}

		// Проверяем, все ли клетки 'tile-' были посещены
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.grid[y][x] === 'tile-' && !visited[y][x]) {
					return false // Если хотя бы одна клетка не посещена
				}
			}
		}

		return true // Все клетки связаны
	}
	// Запуск отрисовки
}

export default Map
