import Vue from 'vue';
import Task from '@/components/widgets/workflow/Task';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import translations from '@/translations';
import { shallow } from '@vue/test-utils';
import _ from 'lodash';

describe('Workflow Task Component', () => {
    Vue.use(VueI18n);
    Vue.use(BootstrapVue);

    const i18n = new VueI18n({
            locale: 'en',
            messages: translations
        }),
        taskInstance = {
            task: {
                _id: 'testId',
                variables: { 'testVar': 'test value' },
                taskDefinition: {
                    formGenerationTemplate: '{name: "test", template: "<div>hello</div>"}'
                }
            },
            processDefinition: {
                _id: 'test',
                name: 'Test process',
                formProperties: [ { _id: 'testVar', name: 'test variable' } ]
            }
        };

    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(Task, {
            i18n,
            propsData: { taskInstance }
        });
    });

    afterEach(() => {
        wrapper = null;
    });

    describe('mount', () => {
        it('should have the correct name', () => {
            expect(wrapper.name()).to.equal('Task');
        });

        it('should have the correct initial data', () => {
            expect(wrapper.vm.taskForm).to.be.an('object').and.to.have.property('name').that.equals('test');
        });
    });

    describe('computed properties', () => {
        it('should have computed "processDefinition"', () => {
            expect(wrapper.vm.processDefinition).to.have.property('formProperties').that.is.an('array');
            expect(wrapper.vm.processDefinition.formProperties.length).to.equal(1);
        });

        it('should have computed "task"', () => {
            expect(wrapper.vm.task).to.be.an('object')
                .and.to.include({ _id: 'testId' })
                .and.to.have.property('variables').that.deep.equals({ 'testVar': 'test value' });
        });

        it('should have computed "taskDetails"', () => {
            expect(wrapper.vm.taskDetails).to.be.an('array')
                .and.to.deep.equal([{ _id: 'testVar', name: 'test variable', value: 'test value' }]);
        });

        it('should have computed "variables"', () => {
            expect(wrapper.vm.variables).to.be.an('object')
                .and.to.deep.equal({testVar: 'test value'});
        });
    });

    describe('#cancel', () => {
        it('should emit "cancel" with the task id', () => {
            wrapper.vm.cancel();
            expect(wrapper.emitted().cancel).to.be.ok; // eslint-disable-line
            expect(wrapper.emitted().cancel[0]).to.deep.equal(['testId']);
        });
    });

    describe('#setTaskForm', () => {
        const updatedTemplateString = '{name: "updated-test-component", template: "<div>hello</div>"}',
            formTemplatePath = 'task.taskDefinition.formGenerationTemplate',
            clonedTaskInstance = _.cloneDeep(taskInstance),
            updatedTaskInstance = _.set(clonedTaskInstance, formTemplatePath, updatedTemplateString);

        it('should emit "cancel" with the task id', () => {
            wrapper.setProps({taskInstance: updatedTaskInstance});
            wrapper.vm.setTaskForm();

            expect(wrapper.vm.taskForm).to.be.an('object').and.to.have.property('name').that.equals('updated-test-component');
        });
    });

    describe('#submit', () => {
        it('should emit "completeTask" with task id and passed formData', () => {
            wrapper.vm.submit({test: 'test'});
            expect(wrapper.emitted().completeTask).to.be.ok; // eslint-disable-line
            expect(wrapper.emitted().completeTask[0]).to.deep.equal([{id: 'testId', formData: {test: 'test'}}]);
        });
    });
});
