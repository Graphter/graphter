import { NodeConfig, PathSegment } from "@graphter/core";
import React, { ComponentType } from "react";
import Crumb from "./Crumb";

interface BreadcrumbsProps {
  path: Array<PathSegment>
  AncestorCrumb: ComponentType<AncestorCrumbProps>
  CurrentCrumb: ComponentType<CurrentCrumbProps>
}

interface AncestorCrumbProps {
  path: Array<PathSegment>
  children: any
}

interface CurrentCrumbProps {
  children: any
}

interface CrumbData {
  config: NodeConfig | null,
  path: Array<PathSegment>,
  display: {
    path?: Array<PathSegment>,
    label: string
  }
}

const guessingNames = [ 'name', 'title', 'headline', 'label', 'id' ]

const DividerSvg = () => <svg className='inline-block w-4 fill-current text-gray-200 mr-2'
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
        clipRule="evenodd"/>
</svg>

const Breadcrumbs = ({ path, AncestorCrumb, CurrentCrumb }: BreadcrumbsProps) => {
  const rootPath = path.slice(0, 2)
  const breadcrumbPaths = path.slice(2).reduce<{
      current: Array<PathSegment>,
      paths: Array<Array<PathSegment>>
    }>((a, c) =>
  {
    a.current = [...a.current, c]
    a.paths.push(a.current)
    return a
  }, { current: rootPath, paths: [ rootPath ] }).paths

  return (
    <div>
      {breadcrumbPaths.map((path, i) => {
        const key = path.join('[bbfb560b-a9b3-49d6-8f28-0d69e9cfc690]')
        return i === breadcrumbPaths.length - 1 ? (
          <CurrentCrumb key={key}><Crumb path={path}/></CurrentCrumb>
        ) : (
          <AncestorCrumb path={path} key={key}><Crumb path={path}/></AncestorCrumb>
        )
      })}
    </div>
  )
  // const starting = path.slice(0, 1)
  // const remaining = path.slice(1)
  // const [ crumbsData, setCrumbsData ] = useState<Array<CrumbData>>([])
  // const initialise = useTreeDataCallback(
  //   (treeData: any) => {
  //     (async () => {
  //       const crumbsData = (await remaining.reduce<Promise<{ current: Array<PathSegment>, crumbsData: Array<CrumbData> }>>(
  //         async (accPromise, c) => {
  //           const a = await accPromise
  //           a.current.push(c)
  //           const pathConfig = await getConfigAt(config, a.current, (path: Array<PathSegment>) => {
  //             return pathUtils.getValueByGlobalPath(treeData, path)
  //           })
  //           if (!pathConfig) throw new Error(`Couldn't find config at ${a.current.join('/')}`)
  //           const display: { path?: Array<PathSegment>, label: string } = {
  //             label: pathConfig?.name || pathConfig?.id || 'Unknown'
  //           }
  //           const renderer = nodeRendererStore.get(pathConfig.type)
  //           if (renderer.newGetChildPaths) {
  //             const childPaths = await renderer.newGetChildPaths(pathConfig, a.current, (path: Array<PathSegment>) => {
  //               return pathUtils.getValueByGlobalPath(treeData, path)
  //             })
  //             const displayPathSegment = getDisplayPathSegment(childPaths)
  //             if (displayPathSegment) {
  //               display.path = [ ...a.current, displayPathSegment ]
  //             }
  //           }
  //           a.crumbsData.push({ config: pathConfig, display, path: [ ...a.current ] })
  //           return Promise.resolve(a)
  //         }, Promise.resolve({ current: starting, crumbsData: [] }))).crumbsData
  //       setCrumbsData(crumbsData)
  //     })()
  //   },
  //   config,
  //   path.slice(0, 2))
  //
  // useEffect(() => {
  //   initialise()
  // }, [ path ])
  //
  // return (
  //   <div>
  //     {crumbsData.map((crumbData, i) => {
  //       const key = crumbData.path.join('/')
  //       const contents = crumbData.display.path ? (
  //         <DynamicCrumb
  //           displayPath={crumbData.display.path}
  //           displayLabel={crumbData.display.label}
  //         />
  //       ) : (
  //         crumbData.display.label
  //       )
  //       return (
  //         <Fragment key={key}>
  //           {i < crumbsData.length - 1 ? (
  //             <>
  //               <AncestorCrumb path={crumbData.path}>
  //                 {contents}
  //               </AncestorCrumb>
  //               <DividerSvg/>
  //             </>
  //           ) : (
  //             <CurrentCrumb key={key}>
  //               {contents}
  //             </CurrentCrumb>
  //           )}
  //         </Fragment>
  //       )
  //     })}
  //   </div>
  // )
}



export default Breadcrumbs