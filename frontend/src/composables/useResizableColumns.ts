import { computed, onBeforeUnmount, ref } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'

interface ResizeConfig {
  minWidth?: number
  maxWidth?: number
  hitArea?: number
}

interface ResizeState {
  index: number
  startX: number
  startWidth: number
}

export function useResizableColumns<T extends object>(
  initialColumns: TableColumnsType<T>,
  config: ResizeConfig = {},
) {
  const minWidth = config.minWidth ?? 100
  const maxWidth = config.maxWidth ?? 800
  const hitArea = config.hitArea ?? 12

  const columnsState = ref<any[]>(
    initialColumns.map((column) => ({
      ...column,
      width: typeof column.width === 'number' ? column.width : 160,
    })),
  )

  const resizeState = ref<ResizeState | null>(null)

  const stopResize = () => {
    if (!resizeState.value) {
      return
    }
    resizeState.value = null
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', stopResize)
  }

  const onMouseMove = (event: MouseEvent) => {
    const state = resizeState.value
    if (!state) {
      return
    }
    const deltaX = event.clientX - state.startX
    const nextWidth = Math.max(minWidth, Math.min(maxWidth, state.startWidth + deltaX))
    const currentColumn = columnsState.value[state.index]
    if (!currentColumn) {
      return
    }
    columnsState.value[state.index] = {
      ...currentColumn,
      width: Math.round(nextWidth),
    }
  }

  const startResize = (event: MouseEvent, index: number) => {
    if (event.button !== 0) {
      return
    }
    const headerCell = event.currentTarget as HTMLElement | null
    if (!headerCell) {
      return
    }
    const rect = headerCell.getBoundingClientRect()
    if (rect.right - event.clientX > hitArea) {
      return
    }

    const currentColumn = columnsState.value[index]
    if (!currentColumn) {
      return
    }

    resizeState.value = {
      index,
      startX: event.clientX,
      startWidth: Number(currentColumn.width) || 160,
    }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopResize)
    event.preventDefault()
    event.stopPropagation()
  }

  onBeforeUnmount(() => {
    stopResize()
  })

  const columns = computed(
    () =>
      columnsState.value.map((column, index) => ({
        ...column,
        customHeaderCell: () => ({
          class: 'resizable-header-cell',
          onMousedown: (event: MouseEvent) => startResize(event, index),
        }),
      })) as TableColumnsType<T>,
  )

  return {
    columns,
  }
}
