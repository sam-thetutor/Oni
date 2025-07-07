// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title PayLink
 * @dev A contract for managing global and fixed payment links and invoices using native XFI.
 */
contract PayLink is Initializable, ReentrancyGuardUpgradeable {
    address private deployer;

    enum statusEnum{
        PENDINDING,
        PAID
    }
    
    struct GlobalPaymentLink {
        address creator;
        string link;
        uint256 totalContributions;
    }
    
    struct FixedPaymentLink {
        address creator;
        string link;
        uint256 amount;
        statusEnum status;
    }

    struct Invoice {
        string invoiceId;
        string productId;
        address from;
        uint256 amount;
        statusEnum status;
    }
    
    mapping(string => GlobalPaymentLink) public globalPaymentLink;
    mapping(string => FixedPaymentLink) public fixedPaymentLink;
    mapping(string => Invoice) public invoice;
    mapping(string => bool) public globalinkIDExist;
    mapping(string => bool) public fixedinkIDExist;
    mapping(string => bool) public invoiceIdExist;
    
    event GlobalPaymentLinkCreated(string link, address creator);
    event FixedPaymentLinkCreated(string link, address creator, uint amount, statusEnum status);
    event ContributionAdded(string link, address contributor, uint256 amount);
    event PaidFixedPayment(string link, address client, uint amount, statusEnum status);
    event InvoiceCreated(
        string invoiceId,
        string productId,
        address from,
        uint256 amount,
        statusEnum status
    );
    event PaidInvoice(string invoiceId, uint256 amount, statusEnum status);

    /**
     * @dev Initializes the contract.
     */
    function initialize() public initializer {
        deployer = msg.sender;
        __ReentrancyGuard_init();
    }
    
    /**
     * @dev Creates a global payment link.
     * @param linkID The ID of the global payment link.
     */
    function createGlobalPaymentLink(string memory linkID) external nonReentrant {
        require(!globalinkIDExist[linkID], "Global link ID already exists");

        globalinkIDExist[linkID] = true; 
        globalPaymentLink[linkID] = GlobalPaymentLink({
            creator: msg.sender,
            link: linkID,
            totalContributions: 0
        });
                
        emit GlobalPaymentLinkCreated(linkID, msg.sender);
    }
    
    /**
     * @dev Contributes to a global payment link.
     * @param linkID The ID of the global payment link.
     */
    function contributeToGlobalPaymentLink(string memory linkID) external payable nonReentrant {
        require(globalinkIDExist[linkID], "Link does not exist");
        require(msg.value > 0, "Must send XFI to contribute");

        globalPaymentLink[linkID].totalContributions += msg.value;
        
        // Transfer contribution to link creator
        payable(globalPaymentLink[linkID].creator).transfer(msg.value);

        emit ContributionAdded(linkID, msg.sender, msg.value);
    }
    
    /**
     * @dev Creates a fixed payment link.
     * @param linkID The ID of the fixed payment link.
     * @param _amount The amount to be paid through the link.
     */
    function createFixedPaymentLink(string memory linkID, uint256 _amount) external nonReentrant {
        require(!fixedinkIDExist[linkID], "Link ID already exists");
        require(_amount > 0, "Amount must be greater than 0");

        fixedinkIDExist[linkID] = true; 
        fixedPaymentLink[linkID] = FixedPaymentLink({
            creator: msg.sender,
            link: linkID,
            amount: _amount,
            status: statusEnum.PENDINDING
        });

        emit FixedPaymentLinkCreated(linkID, msg.sender, _amount, statusEnum.PENDINDING);
    }
    
    /**
     * @dev Pays a fixed payment link.
     * @param linkID The ID of the fixed payment link.
     */
    function payFixedPaymentLink(string memory linkID) external payable nonReentrant {
        require(fixedPaymentLink[linkID].status != statusEnum.PAID, "Link already paid");
        require(fixedinkIDExist[linkID], "Link does not exist");
        require(msg.value == fixedPaymentLink[linkID].amount, "Incorrect payment amount");

        fixedPaymentLink[linkID].status = statusEnum.PAID;
        
        // Transfer payment to link creator
        payable(fixedPaymentLink[linkID].creator).transfer(msg.value);

        emit PaidFixedPayment(linkID, msg.sender, fixedPaymentLink[linkID].amount, fixedPaymentLink[linkID].status);
    }

    /**
     * @dev Creates an invoice.
     * @param _invoiceId The ID of the invoice.
     * @param _productId The ID of the product.
     * @param _amount The amount to be paid.
     */
    function createInvoice(
        string memory _invoiceId,
        string memory _productId,
        uint256 _amount
    ) external nonReentrant {
        require(!invoiceIdExist[_invoiceId], "_invoiceId already exists");
        require(_amount > 0, "Amount must be greater than 0");

        invoiceIdExist[_invoiceId] = true;
        invoice[_invoiceId] = Invoice({
            invoiceId: _invoiceId,
            productId: _productId,
            from: msg.sender,
            amount: _amount,
            status: statusEnum.PENDINDING
        });

        emit InvoiceCreated(_invoiceId, _productId, msg.sender, _amount, statusEnum.PENDINDING);
    }

    /**
     * @dev Pays an invoice.
     * @param _invoiceId The ID of the invoice.
     */
    function payInvoice(string memory _invoiceId) external payable nonReentrant {
        require(invoice[_invoiceId].status == statusEnum.PENDINDING, "Invoice already paid or does not exist");
        require(invoiceIdExist[_invoiceId], "Invoice id does not exist");
        require(msg.value == invoice[_invoiceId].amount, "Incorrect payment amount");

        invoice[_invoiceId].status = statusEnum.PAID;
        
        // Transfer payment to invoice creator
        payable(invoice[_invoiceId].from).transfer(msg.value);

        emit PaidInvoice(invoice[_invoiceId].invoiceId, invoice[_invoiceId].amount, invoice[_invoiceId].status);
    }

    /**
     * @dev Allows the deployer to withdraw any stuck funds (emergency function)
     */
    function emergencyWithdraw() external {
        require(msg.sender == deployer, "Only deployer can withdraw");
        payable(deployer).transfer(address(this).balance);
    }

    /**
     * @dev Returns the contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 