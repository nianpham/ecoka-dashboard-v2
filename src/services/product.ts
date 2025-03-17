import { API } from "@/utils/api";

const getAll = async () => {
  try {
    const response = await fetch(API.GET_ALL_PRODUCTS, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("========= Error Get All Products:", error);
    return false;
  }
};

const createProduct = async (payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(API.CREATE_PRODUCT, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    console.error("========= Error Create Product:", error);
    return false;
  }
};

const updateProduct = async (id: any, payload: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log("check update: " + JSON.stringify(payload));

    const response = await fetch(`${API.UPDATE_PRODUCT}/${id}`, {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    if (!response.ok) {
      console.log("check create: failed", response.status);

      throw new Error(`Failed - Status: ${response.status}`);
    }
    console.log("check create: success", response.status);
    return true;
  } catch (error: any) {
    console.error("========= Error Update Product:", error);
    return false;
  }
};

const deleteProduct = async (id: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`${API.DELETE_PRODUCT}/${id}`, {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    console.error("========= Error Delete Product:", error);
    return false;
  }
};

const getContract = async () => {
  try {
    const myHeaders = new Headers();
    myHeaders.append(
      "user-agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
    );
    myHeaders.append(
      "Cookie",
      "cf_clearance=Kaqa.kljylXGHNQ47USYj1c_5wLlP6TfPDOyMjPan6A-1742193393-1.2.1.1-jzabtWHaeGpUl4dyOq6tkw4NTYnC6Wh0WBG0.aDXdf9_7p9wbJmRBACZbA3zFjhPCIHtDDncZSp69X71SQoSwEoAGLRcEnhG.QUkBSJSyNFFXRBBi4Spfrj9O4S_6CdGHJ68fFXFB9JzBj2R6ohdWKVWcy9Y2RSiQy1H0olhLfkIfpLOcC5xH2A4J1Ogkjo6tetvYjo5CgufITk4tFqWjssHu7Jv0OY2HCu4yEOUI94ac_DBkXo8D_KJ63Md77gH3Afi0upZ0di9uQ16plQIeA._uIF9hTePHEqi3CcCALcJZd_qn.N09e2lndMPVQfjXcASS4PKunI5DXXxbkDAyq3fEOGEWCOZ_jzY.y3sqWj1e9iabFs_nAF.nN.XOB.xIyXMPDZ4gFY2kVzFGZ8M8g7aRNDhYJwq6IP4r9.nzzc; __cf_bm=6CrFN8VQSmUleU1uCLGrsHW3d1dYebB72UnqyYllxLg-1742195346-1.0.1.1-iuaJbqgmkKKC0VwwDVe9adFusnMDgsDEQ7S75pn5r6fOnXd0XSg3_akW4J7YivUW84IzGOGUhxRyMTyeYDv5WWLxXT9WNffjI3K8nN6XowM; __cf_bm=QKlGwhy_BcavJoe7B3Dibi5kYDOVLr95SI0RGjwiu08-1742195851-1.0.1.1-hr.b8sO500tFBMqniHSFLA6zc9Ud5kCdCpfLAmPh2F.VJ8Msh8cKtYZHcHWeyo3_o3COx63iH6gMPzMyqKJ2XnyhkrSnrZotk6rkQ9PSltk"
    );

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow" as const,
      mode: "no-cors",
    };

    const response = await fetch(
      "https://gmgn.ai/defi/quotation/v1/smartmoney/base/walletstat/0x7d07e3c9a427a8222a13fe4cd8bad4aee65b109b?token_address=0x1d008f50fb828ef9debbbeae1b71fffe929bf317&fbclid=IwY2xjawJEoilleHRuA2FlbQIxMAABHQ6XWWJ9d8Vb6aPQWzDyEyWhpqMKQ82GI91p-DVd0WOB6FXFpYJVjqWWSw_aem_9IDdPDcMVHBwgOgkrKwG8Q",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Failed - Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("========= Error Get All Products:", error);
    return false;
  }
};

export const ProductService = {
  getAll,
  createProduct,
  updateProduct,
  deleteProduct,
  getContract,
};
