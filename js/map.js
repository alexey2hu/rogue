console.log('map class loaded')

// Класс для генерации и отображения карты
class Map {
	constructor() {
		this.width = 40
		this.height = 24
		this.tileSize = 25
		this.grid = []
	}

	init() {
		do {
			this.generateWalls()
			this.generateRooms()
			this.generatePassages()
		} while (!this.isAllConnected())
		this.placeObjects()
	}

	generateWalls() {
		this.grid = Array.from({ length: this.height }, () =>
			Array(this.width).fill('tile-W')
		)
	}

	generateRooms() {
		const roomCount = Math.floor(Math.random() * 6) + 5
		for (let i = 0; i < roomCount; i++) {
			const [roomWidth, roomHeight] = [
				Math.floor(Math.random() * 6) + 3,
				Math.floor(Math.random() * 6) + 3,
			]
			const [startX, startY] = [
				Math.floor(Math.random() * (this.width - roomWidth)),
				Math.floor(Math.random() * (this.height - roomHeight)),
			]
			if (!this.checkOverlap(startX, startY, roomWidth, roomHeight)) {
				this.fillArea(startX, startY, roomWidth, roomHeight, 'tile-')
			}
		}
	}

	checkOverlap(startX, startY, width, height, padding = 1) {
		for (let y = startY - padding; y < startY + height + padding; y++) {
			for (let x = startX - padding; x < startX + width + padding; x++) {
				if (
					x >= 0 &&
					y >= 0 &&
					x < this.width &&
					y < this.height &&
					this.grid[y][x] !== 'tile-W'
				) {
					return true
				}
			}
		}
		return false
	}

	fillArea(startX, startY, width, height, tileType) {
		for (let y = startY; y < startY + height; y++) {
			for (let x = startX; x < startX + width; x++) {
				this.grid[y][x] = tileType
			}
		}
	}

	generatePassages() {
		;['vertical', 'horizontal'].forEach(type => {
			const passageCount = Math.floor(Math.random() * 3) + 3
			const passages = []
			for (let i = 0; i < passageCount; i++) {
				let startCoordinate
				do {
					startCoordinate =
						Math.floor(
							Math.random() *
								((type === 'vertical' ? this.width : this.height) - 4)
						) + 2
				} while (passages.some(coord => Math.abs(coord - startCoordinate) < 2))
				passages.push(startCoordinate)
				for (
					let j = 0;
					j < (type === 'vertical' ? this.height : this.width);
					j++
				) {
					if (type === 'vertical') this.grid[j][startCoordinate] = 'tile-'
					else this.grid[startCoordinate][j] = 'tile-'
				}
			}
		})
	}

	getRandomEmptyPosition() {
		let x, y
		do {
			;[x, y] = [
				Math.floor(Math.random() * this.width),
				Math.floor(Math.random() * this.height),
			]
		} while (this.grid[y][x] !== 'tile-')
		return { x, y }
	}

	placeObjects() {
		;[
			{ tileType: 'tile-SW', count: 2 },
			{ tileType: 'tile-HP', count: 10 },
			{ tileType: 'tile-E', count: 10 },
			{ tileType: 'tile-P', count: 1 },
		].forEach(item => {
			for (let i = 0; i < item.count; i++) {
				const { x, y } = this.getRandomEmptyPosition()
				this.grid[y][x] = item.tileType
			}
		})
	}

	// Метод для проверки связности всех клеток типа 'tile-'
	isAllConnected() {
		const visited = Array.from({ length: this.height }, () =>
			Array(this.width).fill(false)
		)
		const directions = [
			[0, 1], // Вниз
			[0, -1], // Вверх
			[1, 0], // Вправо
			[-1, 0], // Влево
		]

		// Находим первую пустую клетку 'tile-'
		let start = null
		for (let y = 0; y < this.height && !start; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.grid[y][x] === 'tile-') {
					start = { x, y }
					break
				}
			}
		}
		if (!start) return true // Нет пустых клеток

		// DFS для проверки связности
		const stack = [start]
		visited[start.y][start.x] = true

		while (stack.length) {
			const { x, y } = stack.pop()

			for (const [dx, dy] of directions) {
				const nx = x + dx,
					ny = y + dy
				if (
					nx >= 0 &&
					ny >= 0 &&
					nx < this.width &&
					ny < this.height &&
					!visited[ny][nx] &&
					this.grid[ny][nx] === 'tile-'
				) {
					visited[ny][nx] = true
					stack.push({ x: nx, y: ny })
				}
			}
		}

		// Проверяем, все ли клетки 'tile-' были посещены
		return this.grid.every((row, y) =>
			row.every((cell, x) => cell !== 'tile-' || visited[y][x])
		)
	}
}

export default Map
