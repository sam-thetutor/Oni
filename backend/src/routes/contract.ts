import express from 'express';
import { ContractController } from '../controllers/contract.js';
import { config } from 'dotenv';
import {
    validatePrivateKey,
    validateAmount,
    validateLinkId,
    validateInvoiceId
} from '../middleware/contract.js';

config();

const router = express.Router();
const contractController = new ContractController();

// Global payment link routes
router.post('/global',
    validatePrivateKey,
    validateLinkId,
    contractController.createGlobalPaymentLink.bind(contractController)
);

router.post('/global/contribute',
    validatePrivateKey,
    validateLinkId,
    validateAmount,
    contractController.contributeToGlobalPaymentLink.bind(contractController)
);

router.get('/global/:linkID',
    validateLinkId,
    contractController.getGlobalPaymentLink.bind(contractController)
);

// Fixed payment link routes
router.post('/fixed',
    validatePrivateKey,
    validateLinkId,
    validateAmount,
    contractController.createFixedPaymentLink.bind(contractController)
);

router.post('/fixed/pay',
    validatePrivateKey,
    validateLinkId,
    validateAmount,
    contractController.payFixedPaymentLink.bind(contractController)
);

router.get('/fixed/:linkID',
    validateLinkId,
    contractController.getFixedPaymentLink.bind(contractController)
);

// Invoice routes
router.post('/invoice',
    validatePrivateKey,
    validateInvoiceId,
    validateAmount,
    contractController.createInvoice.bind(contractController)
);

router.post('/invoice/pay',
    validatePrivateKey,
    validateInvoiceId,
    validateAmount,
    contractController.payInvoice.bind(contractController)
);

router.get('/invoice/:invoiceId',
    validateInvoiceId,
    contractController.getInvoice.bind(contractController)
);

// Utility routes
router.get('/check/:type/:linkId',
    validateLinkId,
    contractController.checkLinkExists.bind(contractController)
);


export default router; 