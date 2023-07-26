import { DragEvent, useCallback, useRef, useState } from 'react'
import './App.css'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  EdgeTypes,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ImageInputNode } from './flows/nodes/ImageInputNode'
import { WhiteToBlackNode } from './flows/nodes/WhiteToBlackNode'
import Split from 'react-split'
import { CustomEdge } from './flows/edges/CustomEdge'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ImagePreviewNode } from './flows/nodes/ImagePreviewNode'
import { IconButton } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Sidebar } from './components/Sidebar'
import { v4 as uuidv4 } from 'uuid'

const nodeTypes = {
  inputImage: ImageInputNode,
  whiteToBlack: WhiteToBlackNode,
  imagePreviewNode: ImagePreviewNode,
}
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

function App() {
  const theme = createTheme({
    components: {
      MuiIconButton: {
        defaultProps: {
          sx: {
            boxShadow: 'none',
          },
        },
      },
    },
  })
  const initialNodes = [
    {
      id: 'node-1',
      type: 'inputImage',
      position: { x: 0, y: 100 },
      data: { label: '3' },
    },
    {
      id: 'w2b',
      type: 'whiteToBlack',
      position: { x: 300, y: 100 },
      data: { label: '3' },
    },
    {
      id: 'ipn',
      type: 'imagePreviewNode',
      position: { x: 600, y: 100 },
      data: { label: '3' },
    },
  ]
  const initialEdges = [
    {
      id: 'e1-2',
      source: 'node-1',
      target: 'w2b',
      data: {
        label: 'edge label',
        onDelete: (id: string) => {
          onEdgeDelete(id)
        },
      },
      type: 'custom',
    },
    {
      id: 'e1-2a',
      source: 'w2b',
      target: 'ipn',
      data: {
        label: 'edge label',
        onDelete: (id: string) => {
          onEdgeDelete(id)
        },
      },
      type: 'custom',
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      console.log('delete edge', edgeId)
      // TODO: Callback all edge data?
      setEdges((eds) => eds.filter((e) => e.id !== edgeId))
    },
    [setEdges]
  )

  const onConnect = useCallback(
    (params: any) => {
      console.log(params)
      params.data = {
        label: 'edge label',
        onDelete: (id: string) => {
          onEdgeDelete(id)
        },
      }
      params.type = 'custom'
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined)
  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
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
        id: 'node-' + uuidv4(),
        type,
        position,
        data: { label: `${type} node` },
      }

      setNodes((nds) => nds.concat(newNode))
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
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
              proOptions={{
                hideAttribution: true,
              }}
              onDrop={(event: DragEvent<HTMLDivElement>) => {
                onDrop(event)
              }}
              onDragOver={onDragOver}
              onInit={(instance: ReactFlowInstance) => {
                console.log('flow loaded:', instance)

                setReactFlowInstance(instance)
              }}
            >
              <Panel position="top-left">
                <IconButton
                  aria-label="settings"
                  sx={{
                    backgroundColor: 'white',
                  }}
                  onClick={() => {
                    console.log('play')
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
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
