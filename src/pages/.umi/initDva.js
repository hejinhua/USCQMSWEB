import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'ProcessActinstModel', ...(require('E:/job/2.1/src/pages/models/activiti/activitiCommon/ProcessActinstModel.js').default) });
app.model({ namespace: 'ProcessActitityPngModel', ...(require('E:/job/2.1/src/pages/models/activiti/activitiCommon/ProcessActitityPngModel.js').default) });
app.model({ namespace: 'ProcessOpinionModel', ...(require('E:/job/2.1/src/pages/models/activiti/activitiCommon/ProcessOpinionModel.js').default) });
app.model({ namespace: 'ActivitiModel', ...(require('E:/job/2.1/src/pages/models/activiti/modelManage/ActivitiModel.js').default) });
app.model({ namespace: 'ActProcdefModel', ...(require('E:/job/2.1/src/pages/models/activiti/modelManage/ActProcdefModel.js').default) });
app.model({ namespace: 'ActMyProcessModel', ...(require('E:/job/2.1/src/pages/models/activiti/personalTask/ActMyProcessModel.js').default) });
app.model({ namespace: 'ActTaskDoneModel', ...(require('E:/job/2.1/src/pages/models/activiti/personalTask/ActTaskDoneModel.js').default) });
app.model({ namespace: 'ActTaskToDoModel', ...(require('E:/job/2.1/src/pages/models/activiti/personalTask/ActTaskToDoModel.js').default) });
app.model({ namespace: 'ActEndProcessModel', ...(require('E:/job/2.1/src/pages/models/activiti/ProcessManage/ActEndProcessModel.js').default) });
app.model({ namespace: 'ActProcessModel', ...(require('E:/job/2.1/src/pages/models/activiti/ProcessManage/ActProcessModel.js').default) });
app.model({ namespace: 'ActRunProcessModel', ...(require('E:/job/2.1/src/pages/models/activiti/ProcessManage/ActRunProcessModel.js').default) });
app.model({ namespace: 'ActStartProcessModel', ...(require('E:/job/2.1/src/pages/models/activiti/ProcessManage/ActStartProcessModel.js').default) });
app.model({ namespace: 'StartProcessModel', ...(require('E:/job/2.1/src/pages/models/activiti/ProcessManage/StartProcessModel.js').default) });
app.model({ namespace: 'admissionTest', ...(require('E:/job/2.1/src/pages/models/admissionTest/admissionTest.js').default) });
app.model({ namespace: 'autoClass', ...(require('E:/job/2.1/src/pages/models/autoClass/autoClass.js').default) });
app.model({ namespace: 'viewStructure', ...(require('E:/job/2.1/src/pages/models/autoClass/viewStructure.js').default) });
app.model({ namespace: 'commonModel', ...(require('E:/job/2.1/src/pages/models/common/commonModel.js').default) });
app.model({ namespace: 'popupModel', ...(require('E:/job/2.1/src/pages/models/common/popupModel.js').default) });
app.model({ namespace: 'DemoModel', ...(require('E:/job/2.1/src/pages/models/demo/DemoModel.js').default) });
app.model({ namespace: 'TabsCardModel', ...(require('E:/job/2.1/src/pages/models/demo/TabsCardModel.js').default) });
app.model({ namespace: 'globalField', ...(require('E:/job/2.1/src/pages/models/globalTable/globalField.js').default) });
app.model({ namespace: 'globalTable', ...(require('E:/job/2.1/src/pages/models/globalTable/globalTable.js').default) });
app.model({ namespace: 'loginModel', ...(require('E:/job/2.1/src/pages/models/login/loginModel.js').default) });
app.model({ namespace: 'MenuModel', ...(require('E:/job/2.1/src/pages/models/menu/MenuModel.js').default) });
app.model({ namespace: 'nav', ...(require('E:/job/2.1/src/pages/models/nav/nav.js').default) });
app.model({ namespace: 'NoticeModel', ...(require('E:/job/2.1/src/pages/models/notice/NoticeModel.js').default) });
app.model({ namespace: 'enterInput', ...(require('E:/job/2.1/src/pages/models/qualityInput/enterInput.js').default) });
app.model({ namespace: 'queryView', ...(require('E:/job/2.1/src/pages/models/queryView/queryView.js').default) });
app.model({ namespace: 'relationship', ...(require('E:/job/2.1/src/pages/models/relationship/relationship.js').default) });
app.model({ namespace: 'AssignRoleModel', ...(require('E:/job/2.1/src/pages/models/sys/AssignRoleModel.js').default) });
app.model({ namespace: 'FileModel', ...(require('E:/job/2.1/src/pages/models/sys/file/FileModel.js').default) });
app.model({ namespace: 'systemLog', ...(require('E:/job/2.1/src/pages/models/sys/systemLog.js').default) });
app.model({ namespace: 'CodeStandardModel', ...(require('E:/job/2.1/src/pages/models/sys/systemPlatform/CodeStandardModel.js').default) });
app.model({ namespace: 'tabModel', ...(require('E:/job/2.1/src/pages/models/tab/tabModel.js').default) });
app.model({ namespace: 'details', ...(require('E:/job/2.1/src/pages/models/tableConfig/details.js').default) });
app.model({ namespace: 'field', ...(require('E:/job/2.1/src/pages/models/tableConfig/field.js').default) });
app.model({ namespace: 'grid', ...(require('E:/job/2.1/src/pages/models/tableConfig/grid.js').default) });
app.model({ namespace: 'menus', ...(require('E:/job/2.1/src/pages/models/tableConfig/menus.js').default) });
app.model({ namespace: 'property', ...(require('E:/job/2.1/src/pages/models/tableConfig/property.js').default) });
app.model({ namespace: 'relation', ...(require('E:/job/2.1/src/pages/models/tableConfig/relation.js').default) });
app.model({ namespace: 'selectField', ...(require('E:/job/2.1/src/pages/models/tableConfig/selectField.js').default) });
app.model({ namespace: 'selectItemNo', ...(require('E:/job/2.1/src/pages/models/tableConfig/selectItemNo.js').default) });
app.model({ namespace: 'selectMenu', ...(require('E:/job/2.1/src/pages/models/tableConfig/selectMenu.js').default) });
app.model({ namespace: 'selectQueryView', ...(require('E:/job/2.1/src/pages/models/tableConfig/selectQueryView.js').default) });
app.model({ namespace: 'selectRelation', ...(require('E:/job/2.1/src/pages/models/tableConfig/selectRelation.js').default) });
app.model({ namespace: 'tableConfig', ...(require('E:/job/2.1/src/pages/models/tableConfig/tableConfig.js').default) });
app.model({ namespace: 'selectFileData', ...(require('E:/job/2.1/src/pages/models/task/selectFileData.js').default) });
app.model({ namespace: 'user', ...(require('E:/job/2.1/src/pages/models/user/user.js').default) });
