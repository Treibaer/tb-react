import express from "express";
import { Page } from "../models/page.js";
import { PageService } from "../services/PageService.js";
import Transformer from "../utils/Transformer.js";

const pageService = PageService.shared;
const router = express.Router();

router.get("/:slug/pages", async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;
    const tickets = await pageService.getAll(projectSlug);
  
    const pageDTOs = await Promise.all(
      tickets.map(async (page: Page) => Transformer.page(page))
    );
    res.status(200).json(pageDTOs);
  } catch (error: any) {
    next(error);
  }
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

router.get("/:slug/pages/:id", async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;
    const pageId = Number(req.params.id);
    const page = await pageService.get(projectSlug, pageId);
    res.status(200).json(await Transformer.page(page));
  } catch (error: any) {
    next(error);
  }
});

router.patch("/:slug/pages/:id", async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;
    const pageId = Number(req.params.id);
    const data = req.body;
    const page = await pageService.update(projectSlug, pageId, data);
    res.status(200).json(await Transformer.page(page));
  } catch (error: any) {
    next(error);
  }
});

export default router;
