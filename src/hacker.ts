import { handleClick } from '../utils/index'

export function addListenClickEvent() {
  window.addEventListener('click', (event) => {
    handleClick(event)
  })
}