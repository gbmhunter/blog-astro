"""
Tool for doing most of the hard work in converting Hugo markdown to Docusaurus mdx.
"""
import argparse
import re
from power_edit import PowerEdit

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("path_glob")
    parser.add_argument('-m', '--modify', action='store_true')
    args = parser.parse_args()

    power_edit = PowerEdit()
    power_edit.sim_run = not args.modify
    files = power_edit.find_files(args.path_glob, recursive=True)
    print(f'Running the Docusaurus-to-Astro converter. Provide -m to actually modify the files, otherwise a dryrun will be performed.')
    print(files)
    for file_path in files:
        # power_edit.find_replace_regex(file_path=file_path, regex_str=r'{{% link[^%]+%}}', replace=link_replace_fn, multiline=True)
        # power_edit.find_replace_regex(file_path=file_path, regex_str=r'\[([^\]]+)\]\(([^)]+)\)', replace=markdown_link_replace_fn, multiline=True)

        # Add imports
        power_edit.find_replace_regex(file_path=file_path, regex_str=r'---[\s\S]*?authors[\s\S]*?---', replace=import_insert_fn, multiline=True)

        # Replace asides
        power_edit.find_replace_regex(file_path=file_path, regex_str=r':::(.*)\n([\s\S]*?)\n:::', replace=aside_replace_fn, multiline=True)

        # Replace images
        power_edit.find_replace_regex(file_path=file_path, regex_str=r'<Image .*?<\/Image>', replace=image_replace_fn, multiline=True)
        # power_edit.find_replace_regex(file_path=file_path, regex_str=r'`?\\\((((?!\\\)).)+)\\\)`?', replace=inline_eq_replace_fn, multiline=True)
        # power_edit.find_replace_regex(file_path=file_path, regex_str=r'\$\$\\begin{align}[\s\S]*?(?=\\end{align}\$\$)\\end{align}\$\$', replace=block_eq_replace_fn, multiline=True)
        # power_edit.find_replace_regex(file_path=file_path, regex_str=r'{{% aside type="(.*?)" %}}(.*?){{% /aside %}}', replace=aside_replace_fn, multiline=True)
        
        # power_edit.find_replace_regex(file_path=file_path, regex_str=r'<p>\$\$(((?!\$\$).)+)\$\$<\/p>', replace=paragraph_eq_replace_fn, multiline=True)

def import_insert_fn(found_text, file_path, match):
    replace_text = found_text + "\n\nimport { Aside, Image } from './src/components/General.astro';"
    return replace_text

def aside_replace_fn(found_text, file_path, match):
    type = match.group(1)
    content = match.group(2)
    replaceText = f'<Aside type="{type}">\n{content}\n</Aside>'

    print('=====================================================')
    print(f'MATCH FOUND IN: {file_path}')
    print('=====================================================')
    print(f'========= Replacing: =============')
    print(found_text)
    print('============ with: =============')
    print(replaceText)

    return replaceText

def markdown_link_replace_fn(found_text, file_path):
    print(file_path)
    print(f'found_text = {found_text}')

    match = re.search(r'\[([^\]]+)\]\(([^)]+)\)', found_text)
    text = match.group(1)
    print(f'text={text}')

    src = match.group(2)
    print(f'src={src}')

    asciidoc_link = f'link:{src}[{text}]'
    print(f'asciidoc_link={asciidoc_link}')

    return asciidoc_link

def image_replace_fn(found_text, file_path):
    print(file_path)
    print(f'found_text = {found_text}')

    # Extract src
    match = re.search(r"src={require\('(.*?)'\).default}", found_text)
    src = match.group(1)
    print(f'src={src}')

    # Extract width
    match = re.search(r'width="([^"]+)"', found_text)
    width = match.group(1)
    print(f'width={width}')

    # Extract caption
    match = re.search(r'<Image .*?>(.*?)<\/Image>', found_text)
    if match is not None:
        caption = match.group(1)
    else:
        caption = ''
    print(f'caption={caption}')

    # Generage astro image
    # Create JS variable name from src
    src_var_name = src
    src_var_name = src_var_name.split('/')[-1] # Just get filename
    src_var_name = src_var_name.split('.')[0] # Remove extension
    src_var_name = src_var_name.replace('-', '_')

    mdx_image = f"\nimport {src_var_name} from '{src}'\n\n<Image src={{{src_var_name}}} width=\"{width}\">{caption}</Image>"

    print(f'====================================================================')
    print(f'mdx_image')
    print(f'====================================================================')
    print(mdx_image)
    return mdx_image

if __name__ == '__main__':
    main()