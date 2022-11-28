import { init as bootstrap } from "./framework/bootstrapper";
import { init as initialisePlatform } from "./framework/platform/platform";
import { getCurrentSync } from "@openfin/workspace-platform";

window.addEventListener("DOMContentLoaded", async () => {
	const platform = fin.Platform.getCurrentSync();
	await platform.once("platform-api-ready", async () => bootstrap());
	await initialisePlatform();

	const getViewsListUrls = async (views) => {
		return await Promise.all(
			views.map(async (view) => {
				return (await view.getOptions()).url;
			})
		);
	};

	setTimeout(async () => {
		await fin.System.showDeveloperTools(fin.me.identity);

		// creates a browser with one page
		const pageOneId = crypto.randomUUID();
		const browser = await getCurrentSync().Browser.createWindow({
			workspacePlatform: {
				pages: [
					{
						layout: {
							content: [
								{
									type: "stack",
									content: [
										{
											type: "component",
											componentName: "view",
											componentState: {
												name: crypto.randomUUID(),
												url: "https://www.openfin.co"
											}
										}
									]
								}
							]
						},
						pageId: pageOneId,
						title: await getCurrentSync().Browser.getUniquePageTitle()
					}
				]
			}
		});
		const viewsPageOne = await browser.openfinWindow.getCurrentViews();

		// adds a second page to browser with two views
		const pageTwoId = crypto.randomUUID();
		await browser.addPage({
			layout: {
				content: [
					{
						type: "stack",
						content: [
							{
								type: "component",
								componentName: "view",
								componentState: {
									name: crypto.randomUUID(),
									url: "https://google.com"
								}
							},
							{
								type: "component",
								componentName: "view",
								componentState: {
									name: crypto.randomUUID(),
									url: "https://www.experoinc.com/"
								}
							}
						]
					}
				]
			},
			title: await getCurrentSync().Browser.getUniquePageTitle(),
			pageId: pageTwoId
		});

		// sets browser's active page to second page
		await browser.setActivePage(pageTwoId);

		const viewsPageTwo = await browser.openfinWindow.getCurrentViews();

		console.log("viewsPageTwo is listing Views on Page One. This is unexpected.", {
			viewsPageOne: await getViewsListUrls(viewsPageOne),
			viewsPageTwo: await getViewsListUrls(viewsPageTwo)
		});

		setTimeout(async () => {
			const viewsPageTwoWorking = await browser.openfinWindow.getCurrentViews();
			console.log("after waiting some time, viewsPageTwo finally lists Views on Page Two", {
				viewsPageOne: await getViewsListUrls(viewsPageOne),
				viewsPageTwoWorking: await getViewsListUrls(viewsPageTwoWorking)
			});
		}, 3000);
	}, 10000);
});
