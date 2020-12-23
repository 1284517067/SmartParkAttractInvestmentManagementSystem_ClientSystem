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

Vue.use(VueRouter);

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
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
