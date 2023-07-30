import { create } from 'zustand'


enum ProcessStatusType {
    'running' = 'running',
    'stop' = 'stop',
    'pause' = 'pause',
}

interface ProcessState {
    count: number
    processStatus: ProcessStatusType
    start: () => void
    progress: () => void
    stop: () => void
    reset: () => void
}

const processStore = create<ProcessState>(
    (set) => ({
        count: 0,
        processStatus: ProcessStatusType.stop,
        start: () => {
            set(() => {
                return {
                    count: 0,
                    processStatus: ProcessStatusType.running
                }
            })
        },
        progress: () => {
            set((state) => {
                return {
                    count: state.count + 1
                }
            })
        },
        stop: () => {
            set(() => {
                return {
                    processStatus: ProcessStatusType.stop
                }
            })
        },
        reset: () => {
            set(() => {
                return {
                    count: 0,
                    processStatus: ProcessStatusType.stop
                }
            })
        }
    })
)
export default processStore;