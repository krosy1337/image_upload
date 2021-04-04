function bytesToSize(bytes) {
	let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (!bytes) return '0 Byte'
	let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

function element(tag, classes=[], content) {
	const node = document.createElement(tag)

	if (classes.length) {
		node.classList.add(...classes)
	}

	if (content) {
		node.textContent = content
	}

	return node
}

function upload(selector, options={}) {
	const input = document.querySelector(selector)
	const preview = element('div', ['preview'])

	const openButton = element('button', ['btn'], 'Открыть')

	if (options.multi) {
		input.setAttribute('multiple', true)
	}

	if (options.accept && Array.isArray(options.accept)) {
		input.setAttribute('accept', options.accept.join(','))
	}
	input.insertAdjacentElement('afterend', preview)
	input.insertAdjacentElement('afterend', openButton)

	function triggerInput() {
		input.click()
	}

	function changeHandler(e) {
		if (e.target.files.length) {
			const files = Array.from(e.target.files)

			preview.innerHTML = ''
			files.forEach(file => {
				if (file.type.match('image')) {
					const reader = new FileReader()

					reader.onload = ev => {
						const src = ev.target.result
						preview.insertAdjacentHTML('afterbegin', `
							<div class="preview__image">
								<div class="preview__remove">&times;</div>
								<img src="${src}" alt="${file.name}">
								<div class="preview__info">
									<span>${file.name}</span>
									${bytesToSize(file.size)}
								</div>
							</div>
						`)
					}

					reader.readAsDataURL(file)
				}
			})
		}
	}

	function closeHandler(e) {
		const target = e.target

		if (target.classList.contains('preview__remove')) {
			const imageContainer = target.closest('.preview__image')

			imageContainer.classList.add('removing')

			imageContainer.addEventListener('transitionend', () => {
				imageContainer.remove()
			})
		}
	}


	openButton.addEventListener('click', triggerInput)

	input.addEventListener('change', changeHandler)

	preview.addEventListener('click', closeHandler)

}

upload('#file', {
	multi: true,
	accept: [
		'.png',
		'.jpg',
		'.jpeg',
		'.gif',
	],
})

