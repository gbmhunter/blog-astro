import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMathJax from 'rehype-mathjax';
import AutoImport from 'astro-auto-import';


// console.log(import.meta.glob('./**/*.md'));

// https://astro.build/config
export default defineConfig({
	integrations: [
		AutoImport({
			imports: [
			  // Import a component’s default export
			  // generates:
			  // import A from './src/components/A.astro';
			  './src/components/A.astro',
	  
			  {
				// Explicitly alias a default export
				// generates:
				// import { default as B } from './src/components/B.astro';
				'./src/components/B.astro': [['default', 'B']],
	  
				// Import a module’s named exports
				// generates:
				// import { Tweet, YouTube } from 'astro-embed';
				'astro-embed': ['Tweet', 'YouTube'],
	  
				// Import all named exports from a module as a namespace
				// generates:
				// import * as Components from './src/components';
				'./src/components': 'Components',
			  },
			],
		  }),
		  // Make sure the MDX integration is included AFTER astro-auto-import
		starlight({
			title: 'My Docs',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Electronics',
					// items: [
					// 	{ label: 'Circuit Design',
					// 		items: [
					// 			'electronics/circuit-design/antenna-design',
					// 		]
					// 	 }
					// ]
					autogenerate: { directory: 'electronics' },
				},
				{
					label: 'Mathematics',					
					autogenerate: { directory: 'mathematics' },
				},
				{
					label: 'PCB Design',					
					autogenerate: { directory: 'pcb-design' },
				},
				{
					label: 'Programming',					
					autogenerate: { directory: 'programming' },
				},
				{
					label: 'Project Management',					
					autogenerate: { directory: 'project-management' },
				},
				{
					label: 'Pyrotechnics',					
					autogenerate: { directory: 'pyrotechnics' },
				},
				{
					label: 'Robotics',					
					autogenerate: { directory: 'robotics' },
				},
				{
					label: 'Site Info',					
					autogenerate: { directory: 'site-info' },
				},
				{
					label: 'Space',					
					autogenerate: { directory: 'space' },
				},
				{
					label: 'Test',
					autogenerate: { directory: 'test' },
				},
			],
		}),
	],
	markdown: {
		extendDefaultPlugins: true,
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
		// rehypePlugins: [rehypeMathJax],
	},
});
