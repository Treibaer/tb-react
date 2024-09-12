import express from "express";
import { Page } from "../models/page.js";
import { SQLPageService } from "../services/SQLPageService.js";
import Transformer from "../utils/Transformer.js";

const pageService = SQLPageService.shared;
const router = express.Router();

router.get("/:slug/pages", async (req, res) => {
  const projectSlug = req.params.slug;
  const tickets = await pageService.getAll(projectSlug);

  const pageDTOs = await Promise.all(
    tickets.map(async (page: Page) => Transformer.page(page))
  );
  res.status(200).json(pageDTOs);
});

router.get("/:slug/opened-pages", async (_, res, next) => {
  try {
    // const projectSlug = req.params.slug;
    const pages = await pageService.getOpenedPages();
    res.status(200).json(pages);
  } catch (error: any) {
    next(error);
  }
});

router.post("/:slug/opened-pages", async (req, res, next) => {
  try {
    const pages = await pageService.getOpenedPages();
    const newPage = req.body.pageId;
    const updatedPages = pages.includes(newPage)
      ? pages.filter((page) => page !== newPage)
      : [...pages, newPage];
    await pageService.setOpenedPages(updatedPages);
    res.status(200).json(pages);
  } catch (error: any) {
    next(error);
  }
});


export default router;
