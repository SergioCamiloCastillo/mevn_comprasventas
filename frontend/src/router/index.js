import Vue from "vue";
import Router from "vue-router";
import store from "../store/index";
import Home from "../views/Home.vue";
import Categorias from "../components/admin/Categorias.vue";
import Login from "../components/admin/Login.vue";
import Usuarios from "../components/admin/Usuarios.vue";

import Articulos from "../components/admin/Articulos.vue";
import Clientes from '../components/admin/Clientes.vue'
import Proveedor from '../components/admin/Proveedor.vue'
import Ingresos from '../components/admin/Ingresos.vue'

Vue.use(Router);

var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: "/admin/login",
      name: "login",
      component: Login,
      meta: {
        libre: true
      }
    },
    {
      path: "/admin/categorias",
      name: "categorias",
      component: Categorias,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    
    {
      path: "/admin/articulos",
      name: "articulos",
      component: Articulos,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: "/admin/usuarios",
      name: "usuarios",
      component: Usuarios,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: "/admin/clientes",
      name: "clientes",
      component: Clientes,
      meta: {
        administrador: true,
        vendedor: true
      }
    },
    {
      path: "/admin/provedor",
      name: "proveedor",
      component: Proveedor,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    {
      path: "/admin/ingresos",
      name: "ingresos",
      component: Ingresos,
      meta: {
        administrador: true,
        almacenero: true
      }
    },
    
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
    next();
  } else if (
    store.state.usuario &&
    store.state.usuario.rol == "Administrador"
  ) {
    if (to.matched.some(record => record.meta.administrador)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == "Vendedor") {
    if (to.matched.some(record => record.meta.vendedor)) {
      next();
    }
  } else if (store.state.usuario && store.state.usuario.rol == "Almacenero") {
    if (to.matched.some(record => record.meta.almacenero)) {
      next();
    }
  } else {
    next({ name: "login" });
  }
});
export default router;
