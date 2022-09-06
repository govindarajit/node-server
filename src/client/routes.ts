import * as countryController from "./controllers/country";
import * as dataLoadSettingController from "./controllers/dataLoadSetting";
import * as chcAlignmentController from "./controllers/chcAlignment";
import * as sheetSettingController from "./controllers/sheetSetting";
import * as columnSettingController from "./controllers/columnSetting";
import * as masterColumnController from "./controllers/masterColumn";
import * as userController from "./controllers/user";
import * as templateController from "./controllers/requestTemplate";
import * as emailController from "./controllers/email";
import * as marketSaleController from "./controllers/marketSale";
import * as fileUploadController from "./controllers/fileUpload";
import fileUploadMiddleware from "./middlewares/fileupload.middleware";
import chcAlignmentMiddleware from "./middlewares/chcAlignment.middleware";
import { auth } from "../shared/middlewares/auth.middleware";
import { allow } from "../shared/middlewares/acl.middleware";
import { UserRoles } from "../shared/models/UserRoles";
import { ColumnOrder } from "../shared/lib/dataLoad/order";


const routes = require("express").Router();

/**
 * Mailer
 */
routes.get("/daily-mail",fileUploadController.dailyMail);

/**
 * User routes
 */
routes.get("/user/list", auth, allow([UserRoles.SuperAdmin]), userController.getUsers);
routes.post("/user", userController.getUserByEmail);
routes.post("/user/add-user", auth, allow([UserRoles.SuperAdmin]), userController.addUser);
routes.post("/user/update", auth, allow([UserRoles.SuperAdmin]), userController.update);
routes.delete("/user/:id", auth, allow([UserRoles.SuperAdmin]), userController.deleteUser);
routes.post("/user/login", userController.loginUser);

/**
 * country routes
 */
routes.get("/countries",auth, countryController.getAllCountryData);

/**
 * master column routes
 */
routes.get("/master-column", auth, masterColumnController.getMasterColumnData);

/**
 * Data load setting id
 */
routes.get("/data-load-settings/home", auth, dataLoadSettingController.getHomeData);
routes.get("/data-load-settings", auth, dataLoadSettingController.getByCountry);
routes.get("/data-load-settings/:id", auth, dataLoadSettingController.getSettings);
routes.delete("/data-load-settings/delete-files", auth, fileUploadMiddleware.any(), dataLoadSettingController.deleteFiles);
routes.get("/data-load-settings/:dataSettingId", auth, dataLoadSettingController.getById);
routes.post("/data-load-settings/add", auth, allow([UserRoles.SuperAdmin]), dataLoadSettingController.addDataLoadSetting);
routes.put("/data-load-settings/update", auth, allow([UserRoles.SuperAdmin]), dataLoadSettingController.updateDataLoadSetting);
routes.delete("/data-load-settings/delete/:id", auth, allow([UserRoles.SuperAdmin]), dataLoadSettingController.deleteDataLoadSetting);
routes.post("/data-load-settings/add", auth, allow([UserRoles.SuperAdmin]), dataLoadSettingController.addDataLoadSetting);
routes.put("/data-load-settings/update", auth, allow([UserRoles.SuperAdmin]), dataLoadSettingController.updateDataLoadSetting);
routes.delete("/data-load-settings/delete/:id", auth, allow([UserRoles.SuperAdmin]), dataLoadSettingController.deleteDataLoadSetting);

/**
 * File upload
 */
routes.post("/file-upload", auth, fileUploadMiddleware.any(), fileUploadController.index);
routes.post("/file-upload/save", auth, fileUploadController.save);
routes.get("/file-upload/status/:fileUploadId", auth, fileUploadController.getFileStatus);
//routes.post("/file-upload/sanity-check", auth, fileUploadController.sanityCheck);
routes.get("/file-upload/:currentFileUploadId", auth, fileUploadController.getPreviousFileUpload);
routes.get("/file-upload/latest/:dataLoadSetting", auth, fileUploadController.getLatestFileUpload);
routes.get("/file-upload/status/:fileUploadId", auth, fileUploadController.getFileStatus);
routes.get("/file-upload/id/:fileUploadId", auth, fileUploadController.getById);
routes.get("/file-upload/file-upload-details/:fileUploadId", auth, fileUploadController.fileUploadDetails);
routes.delete("/file-upload/approved/:currentFileUploadId/:previousFileUploadId", auth, fileUploadController.fileApproved);
routes.delete("/file-upload/rejected/:currentFileUploadId", auth, fileUploadController.fileRejected);
routes.get("/file-upload/errors/:fileUploadId/:fileSettingId/:sheetSettingId", auth, fileUploadController.getErrors);
routes.get("/file-upload/download-cleaned-file/:fileUploadId", auth, fileUploadController.downloadCleanedFile);

/**
 * panel-setting routes
 */
routes.get("/panel-settings", auth, allow([UserRoles.SuperAdmin]), sheetSettingController.getPanelSettings);
routes.post("/panel-setting/delete", auth, allow([UserRoles.SuperAdmin]), sheetSettingController.deletePanelSettings);
routes.get("/panel-setting/id", auth, allow([UserRoles.SuperAdmin]), sheetSettingController.getPanelData);
routes.post("/panel-setting/add", auth, allow([UserRoles.SuperAdmin]), sheetSettingController.addPanelSettings);

/**
 * panel-column routes
 */
routes.get("/panel-column", auth, allow([UserRoles.SuperAdmin]), columnSettingController.getPanelColumnSettings);
routes.post("/panel-columns/add", auth, allow([UserRoles.SuperAdmin]), columnSettingController.addPanelColSetting);
routes.delete("/panel-column/:id", auth, allow([UserRoles.SuperAdmin]), columnSettingController.deletePanelColSetting);

/**
 * market-sales routes
 */
routes.post("/market-sales/:previousFileId/:currentFileId", auth, marketSaleController.getSalesData);
routes.post("/market-sales/:previousFileId/:currentFileId/:field", auth, marketSaleController.getUniqueData);
routes.get("/market-sales/previous-preview-data", auth, marketSaleController.getPreviousPreviewData);
routes.delete("/market-sales/:fileUploadId", auth, marketSaleController.deleteMarketSales);
routes.post("/market-sales/:fileUploadId", marketSaleController.getatc4Data);
routes.post("/market-sales-product/:fileUploadId", marketSaleController.getproductData);
routes.post("/market-sales-pack/:fileUploadId", marketSaleController.getpackData);
/**
 * chcAlignment upload
 */
routes.get("/chc-alignment/get-data",auth, chcAlignmentController.getChcAlignments);
routes.post("/chc-alignment/upload", auth, chcAlignmentMiddleware.any(), chcAlignmentController.addChcAlignment);

/**
 * changeRequest
 */
routes.get("/chc-alignment/get-change-request-data",auth,  chcAlignmentController.getChcChangeRequest);
//routes.post("/changeRequest", auth, chcAlignmentController.addRequest);
routes.post("/changeRequest", auth, chcAlignmentController.addRequest);
routes.delete("/chc-changeRequest/approve/:currentDocumentId", auth, chcAlignmentController.changeRequestApproved);
routes.delete("/chc-changeRequest/reject/:currentDocumentId/:reason", auth, chcAlignmentController.changeRequestRejected);
routes.get("/chc-changeRequest/getId/:currentDocumentId", auth, chcAlignmentController.getId);
routes.get("/market-sales/column-order", auth, (req: any, res: any) => {
    res.json(ColumnOrder);
 });

/**
 * threshold
 */
routes.get("/market-sales/summary/:field/:currentFileId/:previousFileId", auth, marketSaleController.summary);

/**
 * email
 */
routes.post("/send-email/graphs", emailController.sendEmail);

routes.post("/templateRequest",templateController.addTemplateRequest);
routes.post("/templateInputRequest",templateController.addInputTemplateRequest);
routes.post("/templateInputWorkbookRequest",templateController.addInputWorkbookTemplateRequest);
routes.post("/templateInputTableRequest",templateController.addInputTableTemplateRequest);
routes.post("/templateInputRowRequest",templateController.addInputRowTemplateRequest);
routes.post("/templateOutputRequest",templateController.addOutputTemplateRequest);
routes.post("/templateMappingRequest",templateController.addMappingTemplateRequest);
routes.post("/gettemplateRequestByUser",templateController.getTemplateRequestByUser);
routes.get("/getTemplateRequestById/:id",templateController.getTemplateRequestById);
routes.get("/getTemplateRequest",templateController.getTemplateRequest);
routes.post("/updateStatusTemplateRequest/:id",templateController.updateStatusTemplateRequest);
routes.post("/updateStatusByRejectTemplateRequest",templateController.updateStatusByRejectTemplateRequest);
routes.get("/getWorkbookTemplateRequestById/:id",templateController.getWorkbookTemplateRequestById);
routes.delete("/deletetemplateRequest/:id",templateController.deleteTemplateRequest);
 


module.exports = routes;

