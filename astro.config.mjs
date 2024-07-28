import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMathJax from "rehype-mathjax";
import AutoImport from "astro-auto-import";

// Build menu for starlight sidebar

// This will return paths like './src/content/docs/space/gdal/index.mdx': [Function: ./src/content/docs/space/gdal/index.mdx],
const pagePaths = import.meta.glob("./src/content/docs/**/*.mdx");
let maxNum = 0;

// For building up the sidebar info
let sidebarNodes = {
  label: 'root',
  items: [], 
};

for (const path in pagePaths) {
  maxNum++;
  console.log(path);
  if (maxNum > 9999) {
    break;
  }

  // console.log('path:', await pagePaths[path]());


  // Skip all .mdx files that are in a directory starting with an underscore or the file itself starts with an underscore
  // (we use this to indicate the file is a partial)
  if (path.includes('/_')) {
    continue;
  }


  // Get the path without the './src/content/docs/' prefix
  const pathWithoutPrefix = path.replace('./src/content/docs/', '');
  // console.log(pathWithoutPrefix);

  // Calculate slug by removing index.mdx from the end of the path
  let slug = pathWithoutPrefix.replace('/index.mdx', '');
  // slug = slug + '/';
  // console.log('slug:', slug);

  // Split the path into an array of directories and the file name
  const pathParts = pathWithoutPrefix.split('/');
  // Get rid of the file name (should be index.mdx)
  pathParts.pop();
  // console.log(pathParts);
  let currentNode = sidebarNodes;
  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i];
    // console.log(pathPart);

    // See if object with label=pathPart exists in currentNode
    const foundChildNodes = currentNode.items.filter((node) => {
      return node.label === pathPart;
    });
    if (foundChildNodes.length === 0) {
      // console.log(`Node with id ${pathPart} not found in ${JSON.stringify(currentNode)}. Creating new node...`);

     
      // Create a new node
      let newNode;
      if (i === pathParts.length - 1) {
        // This is a leaf node
        newNode = {
          label: pathPart,
          items: [],
          slug: slug,
        };
      } else {
        // This is a leaf node
        newNode = {
          label: pathPart,
          items: [],
        };
      }
      
      currentNode.items.push(newNode);
      currentNode = newNode;
      
    } else if (foundChildNodes.length === 1) {
      // Node already exists
      if (i === pathParts.length - 1) {
        console.error('At end of path, node already exists.');
      } else {
        // console.log(`Node with label ${pathPart} found in ${currentNode}.`);
        currentNode = foundChildNodes[0];

        if (currentNode.items === undefined) {
          console.error(`Node ${currentNode} is a branch node but does not have an items array.`);
          currentNode.items = [];
        }
      }
    } else {
      console.error(`Found more than one node with label ${pathPart} in ${currentNode}.`);
    }
    // console.log(`sidebar is now:`, JSON.stringify(sidebarNodes));

  }
}

// console.log('before converting leaf nodes:', JSON.stringify(sidebarNodes, null, 2));

function convertLeafNodes(node) {
  if (node.items.length === 0) {
    // Delete items array
    delete node.items;
    // Delete label
    delete node.label;
    // Leave slugs
    return;
  }

  // Must not be a leaf node
  // Change from page-name to Page Name
  node.label = node.label.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  node.collapsed = true;

  for (let i = 0; i < node.items.length; i++) {
    convertLeafNodes(node.items[i]);
  } 
}

console.log('Converting leaf nodes...');
convertLeafNodes(sidebarNodes);

// console.log('sidebar finished:', JSON.stringify(sidebarNodes, null, 2));

// https://astro.build/config
export default defineConfig({
  integrations: [
    AutoImport({
      imports: [
        // Import a component’s default export
        // generates:
        // import A from './src/components/A.astro';
        "./src/components/A.astro",

        {
          // Explicitly alias a default export
          // generates:
          // import { default as B } from './src/components/B.astro';
          "./src/components/B.astro": [["default", "B"]],

          // Import a module’s named exports
          // generates:
          // import { Tweet, YouTube } from 'astro-embed';
          "astro-embed": ["Tweet", "YouTube"],

          // Import all named exports from a module as a namespace
          // generates:
          // import * as Components from './src/components';
          "./src/components": "Components",
        },
      ],
    }),
    // Make sure the MDX integration is included AFTER astro-auto-import
    starlight({
      title: "My Docs",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      customCss: [
        // Relative path to your custom CSS file
        "./src/styles/custom.css",
      ],
      // sidebar: [
      //   {
      //     label: "Guides",
      //     items: [
      //       // Each item here is one entry in the navigation menu.
      //       { label: "Example Guide", slug: "guides/example" },
      //     ],
      //   },
      //   {
      //     label: "Reference",
      //     autogenerate: { directory: "reference" },
      //   },
      //   {
      //     label: "Electronics",
      //     // items: [
      //     // 	{ label: 'Circuit Design',
      //     // 		items: [
      //     // 			'electronics/circuit-design/antenna-design',
      //     // 		]
      //     // 	 }
      //     // ]
      //     autogenerate: { directory: "electronics" },
      //   },
      //   {
      //     label: "Mathematics",
      //     autogenerate: { directory: "mathematics" },
      //   },
      //   {
      //     label: "PCB Design",
      //     autogenerate: { directory: "pcb-design" },
      //   },
      //   {
      //     label: "Programming",
      //     autogenerate: { directory: "programming" },
      //   },
      //   {
      //     label: "Project Management",
      //     autogenerate: { directory: "project-management" },
      //   },
      //   {
      //     label: "Pyrotechnics",
      //     autogenerate: { directory: "pyrotechnics" },
      //   },
      //   {
      //     label: "Robotics",
      //     autogenerate: { directory: "robotics" },
      //   },
      //   {
      //     label: "Site Info",
      //     autogenerate: { directory: "site-info" },
      //   },
      //   {
      //     label: "Space",
      //     autogenerate: { directory: "space" },
      //   },
      //   {
      //     label: "Test",
      //     autogenerate: { directory: "test" },
      //   },
      // ],
      sidebar: sidebarNodes.items,
    }),
  ],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    // rehypePlugins: [rehypeMathJax],
  },
});
