import Checkbox from './src/checkbox';
import CheckboxGroup from './src/checkbox-group.vue';
/* istanbul ignore next */
CheckboxGroup.install = function(Vue) {
  Vue.component(CheckboxGroup.name, CheckboxGroup);
};
Checkbox.install = function(Vue) {
  Vue.component(Checkbox.name, Checkbox);
};
export{
  CheckboxGroup, Checkbox
}
