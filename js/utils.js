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
}

export default Utils
