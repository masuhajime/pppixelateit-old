import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box, IconButton } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DragEvent, useCallback, useRef, useState } from 'react'
import Split from 'react-split'
import ReactFlow, {
  Background,
  Controls,
  EdgeChange,
  EdgeTypes,
  NodeChange,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import './App.css'
import './styles-node-global.css'
import { Sidebar } from './components/Sidebar'
import { CustomEdge } from './flows/edges/CustomEdge'
import processStore from './store/processStore'

import { shallow } from 'zustand/shallow'
import { getNodeTypesForReactFlow } from './flows/nodes'
import processController from './process/imageProcess'
import useNodeStore, { RFState } from './store/store'

const nodeTypes = getNodeTypesForReactFlow()
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
    components: {
      MuiIconButton: {
        defaultProps: {
          sx: {},
        },
      },
    },
  })

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeAdd } =
    useNodeStore(
      (state: RFState) => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        nodeAdd: state.nodeAdd,
      }),
      shallow
    )

  const onConnectCustom = useCallback(
    (params: any) => {
      console.log(params)
      params.data = {}
      params.type = 'custom'
      onConnect(params)
    },
    [onConnect]
  )

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined)
  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const init = useCallback(() => {
    console.log('init')
    processStore.getState().reset()
    // processStore.subscribe((state) => {
    //   console.log('App: processStore in subscribe', state)
    // })
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      console.log('onDrop', event)

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      const newNode = {
        id: `node-${type}-${uuidv4()}`,
        type,
        position,
        data: { settings: {} },
      }
      nodeAdd(newNode)
    },
    [reactFlowInstance]
  )
  return (
    <ThemeProvider theme={theme}>
      <ReactFlowProvider>
        <Split
          sizes={[25, 75]}
          minSize={10}
          expandToMin={false}
          gutterSize={8}
          gutterAlign="center"
          snapOffset={10}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Sidebar />
          <div
            style={{ width: '100vw', height: '100vh' }}
            className="reactflow-wrapper"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={(changes: NodeChange[]) => {
                onNodesChange(changes)
              }}
              onEdgesChange={(changes: EdgeChange[]) => {
                onEdgesChange(changes)
              }}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnect={onConnectCustom}
              proOptions={{
                hideAttribution: true,
              }}
              onDrop={(event: DragEvent<HTMLDivElement>) => {
                onDrop(event)
              }}
              onDragOver={onDragOver}
              onInit={(instance: ReactFlowInstance) => {
                console.log('flow loaded:', instance)
                init()
                setReactFlowInstance(instance)
              }}
            >
              <Panel position="top-left">
                <Box
                  sx={{
                    backgroundColor: 'rgba(128,128,128,0.5)',
                    borderRadius: '50%',
                  }}
                >
                  <IconButton
                    aria-label="settings"
                    onClick={() => {
                      console.log('play')
                      //processStore.getState().start()
                      processController.start()
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>
              </Panel>
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </Split>
      </ReactFlowProvider>
    </ThemeProvider>
  )
}

export default App
