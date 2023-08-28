const { intro, outro, isCancel, text, select, prompt } = require('@clack/prompts');
const color = require('picocolors');
const fileSystem = require('fs');

intro('Vue.js Component Generator');

const main = async () => {
  
  const name = await text({
    message: 'Component name',
    validate: (value) => {
      if ( !value ) {
        return 'Component name is required';
      }
      if ( fileSystem.existsSync(`./src/components/${value}`) ) {
        return 'Component already exists';
      } else {
        fileSystem.mkdirSync(`./src/components/`, { recursive: true });
      }
      return;
    }
  })
  
  const componentApi = await select({
    message: 'Component API',
    options: [
      {value: 'options', label: 'Options API'},
      {value: 'composition', label: 'Composition API'}
    ]
  })
  
  const scriptType = await select({
    message: 'Script type',
    options: [
      {value: 'ts', label: 'TypeScript'},
      {value: 'js', label: 'JavaScript'}
    ]
  })
  
  const styleType = await select({
    message: 'Style type',
    options: [
      {value: 'css', label: 'CSS'},
      {value: 'scss', label: 'SCSS'},
      {value: 'less', label: 'LESS'},
    ]
  })
  
  const isScoped = await select({
    message: 'Scoped styles',
    options: [
      {value: true, label: 'Yes'},
      {value: false, label: 'No'}
    ]
  })
  
  const directory = `./src/components/`;
  
  
  let component = `
<template>
  <div class="component-${name.toLowerCase()}">
    <!-- templating code goes here. -->
  </div>
</template>\n
  `;
  
  let componentScript = `<script `;
  
  if ( componentApi === 'composition' ) {
    componentScript += `setup `;
  } else {
    componentScript += ``;
  }
  
  if ( scriptType === 'ts' ) {
    componentScript += 'lang="ts"'
  }
  
  componentScript += `></script>\n`;
  
  component += componentScript;
  
  let componentStyle = `<style `;
  
  switch (styleType) {
    case 'scss':
      componentStyle += `lang="scss" `;
      break;
    case 'less':
      componentStyle += `lang="less" `;
      break;
    default:
      componentStyle += ``;
  }
  
  if ( isScoped ) {
    componentStyle += `scoped>`;
  }

  componentStyle += `
  .component-${name.toLowerCase()} {\n  /* styling code goes here. */  \n}\n`;
  
  componentStyle += `</style>`;
  
  component += componentStyle;
  
  // check if component directory exists
  if ( fileSystem.existsSync(directory) ) {
    fileSystem.writeFileSync(`${directory}/${name}.vue`, component);
  }
  
  outro(`Created ${color.green(name)} component`);
}

main();