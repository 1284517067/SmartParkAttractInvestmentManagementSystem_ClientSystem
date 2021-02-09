import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login";
import Main from "@/views/Main";
import IndustryTypeManagement from "@/components/IndustryTypeManagement";
import ProjectCenter from "@/components/ProjectCenter";
import LoginApi from "@/api/LoginApi";
import ApprovalProcessManagement from "@/components/ApprovalProcessManagement";
import ApprovalProcessNodeManagement from "@/components/ApprovalProcessNodeManagement";
import PositionManagement from "@/components/PositionManagement";
import UserManagement from "@/components/UserManagement";
import MenuManagement from "@/components/MenuManagement";
import RolePrivilegesManagement from "@/components/RolePrivilegesManagement";
import EnterpriseArchives from "@/components/EnterpriseArchives";
import SpatialDataManagement from "@/components/SpatialDataManagement";
import ProjectSea from "@/components/ProjectSea";
import IntentionRegistrationManagement from "@/components/IntentionRegistrationManagement";
import ProjectRecycleBin from "@/components/ProjectRecycleBin";
import MyProject from "@/components/MyProject";
import ApprovalMessage from "@/components/ApprovalMessage";
import IntentionAgreementManagement from "@/components/IntentionAgreementManagement";
import LeaseContractApplication from "@/components/LeaseContractApplication";
import PayItemManagement from "@/components/PayItemManagement";

Vue.use(VueRouter);

let vue = new Vue();

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/main",
    component: Main,
    children: [
      {
        path: "IndustryTypeManagement",
        component: IndustryTypeManagement
      },
      {
        path: "ProjectCenter",
        component: ProjectCenter
      },
      {
        path: "ApprovalProcessManagement",
        component: ApprovalProcessManagement
      },
      {
        path: "ApprovalProcessNodeManagement",
        component: ApprovalProcessNodeManagement
      },
      {
        path: "PositionManagement",
        component: PositionManagement
      },
      {
        path: "UserManagement",
        component: UserManagement
      },
      {
        path: "MenuManagement",
        component: MenuManagement
      },
      {
        path: "RolePrivilegesManagement",
        component: RolePrivilegesManagement
      },
      {
        path: "EnterpriseArchives",
        component: EnterpriseArchives
      },
      {
        path: "SpatialDataManagement",
        component: SpatialDataManagement
      },
      {
        path: "ProjectSea",
        component: ProjectSea
      },
      {
        path: "IntentionRegistrationManagement",
        component: IntentionRegistrationManagement
      },
      {
        path: "ProjectRecycleBin",
        component: ProjectRecycleBin
      },
      {
        path: "MyProject",
        component: MyProject
      },
      {
        path: "ApprovalMessage",
        component: ApprovalMessage
      },
      {
        path: "IntentionAgreementManagement",
        component: IntentionAgreementManagement
      },
      {
        path: "LeaseContractApplication",
        component: LeaseContractApplication
      },
      {
        path: "PayItemManagement",
        component: PayItemManagement
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    let token = localStorage.getItem("Authorization");
    if (token === null || token === "") {
      vue.$message({
        showClose: true,
        message: "登录已过期",
        type: "error"
      });
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
