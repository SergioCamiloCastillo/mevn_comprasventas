import routerx from 'express-promise-router';
import ventaController from '../controllers/VentaController';
import auth from '../middlewares/auth';

const router = routerx();

router.post('/add', auth.verifyVendedor, ventaController.add);
router.get('/query', auth.verifyVendedor, ventaController.query);
router.get('/list', auth.verifyVendedor, ventaController.list);

router.put('/activate', auth.verifyVendedor, ventaController.activate);
router.put('/deactivate', auth.verifyVendedor, ventaController.deactivate);
router.get('/grafico12meses', auth.verifyUsuario, ventaController.grafico12Meses);
router.get('/consulta', auth.verifyVendedor, ventaController.consultaFechas);


export default router;