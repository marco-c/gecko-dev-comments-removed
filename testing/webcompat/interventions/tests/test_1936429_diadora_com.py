import pytest

URL = "https://www.diadora.com/en/us/men/?srule=sorting-in-season&prefn1=descrizioneCategoriaMerceologica&prefv1=Shoes"

POPUPS_CSS = "#CybotCookiebotDialog, #CybotCookiebotDialog *, #modal-geolocation-change, #modal-geolocation-change *, .modal-backdrop, .modal-backdrop *"
SELECT_CSS = ".paginationNumbers .select2.select2-container"
CONTAINER_CSS = ".select2-results"


async def get_container_width_difference(client):
    await client.navigate(URL, wait="none")
    client.hide_elements(POPUPS_CSS)
    client.click(client.await_css(SELECT_CSS, is_displayed=True))
    container = client.await_css(CONTAINER_CSS)
    return client.execute_script(
        """
      return arguments[0].getBoundingClientRect().width - arguments[0].firstChild.getBoundingClientRect().width;
    """,
        container,
    )


@pytest.mark.skip_platforms("android")
@pytest.mark.need_visible_scrollbars
@pytest.mark.asyncio
@pytest.mark.with_interventions
async def test_enabled(client):
    
    assert 10 == await get_container_width_difference(client)


@pytest.mark.skip_platforms("android")
@pytest.mark.need_visible_scrollbars
@pytest.mark.asyncio
@pytest.mark.without_interventions
async def test_disabled(client):
    
    assert 10 < await get_container_width_difference(client)
