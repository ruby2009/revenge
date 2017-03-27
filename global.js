$(document).ready(function(){


  api_root = "https://pure-castle-24398.herokuapp.com/"

  tag_notes_url = "https://pure-castle-24398.herokuapp.com/api/notes/tag/"

  function note_url() {
    return api_root + "api/notes"
  }

  function tag_display(tags) {
    list=""
    tags.forEach(function(disp){
      list += `<button type="button" class="tag_button btn-info" href="${disp.name}">${disp.name}</button>`
      })
      return list
  }

  function note_display(note) {
    if (note.user === null) {
      return `
      <div class="note-bg" id=${note.id}>
        <div class="media">

            <div class="media-body">
                <h4> ${note.title} </h4>
                ${note.body}
              <p><small>Posted at: ${moment(note.created_at).format('llll')}</small></p>
            </div>

        </div>
      </div>
      `
    }
    else {
      return `
              <div class="note-bg" id=${note.id}>
                <div class="media">
                  <h3 class="media-heading">
                    ${note.user.username}
                  </h3>
                    <div class="media-body">
                      <h4> ${note.title} </h4>
                      ${note.body}
                    <p><small>Posted at: ${moment(note.created_at).format('llll')}</small></p>
                      ${tag_display(note.tags)}
                  </div>
                  </div>
                </div>
              </div>
            `
  }
}

  function modal_display(id) {
    $('#modal_one .modal-body').html($(id).html())
    $ ('#modal_one').modal('show')
  }

  function first_load(){
    $('#note').empty()
    $.getJSON(note_url())
      .done(function(response){
        response.notes.forEach(function(note){
          $('#note').append(
            note_display(note)
          )
        })
        if(window.location.hash){
          modal_display(location.hash)
         }
       })
      }

  $(document).on('click', '.tag_button', function(ev){
    // ev.preventDefault()
    id_to_fetch = $(ev.target).attr("href")
    console.log(id_to_fetch)
    display_notes_by_tag(id_to_fetch)
    $('#tag_name').append(
      ": " + id_to_fetch)
  })

  function display_notes_by_tag(tag) {
    $('#note').empty()
    $.getJSON(tag_notes_url + tag)
      .done(function(response){
        response.tags.forEach(function(note){
          note.notes.forEach(function(innote){
          $('#note').append(
            note_display(innote)
          )
          })
        })
      })
  }

  function reset_form(form_id){
    $(form_id)[0].reset()
  }

  $('#post_note').on('submit', function(ev){
    ev.preventDefault()
    $.post(api_root + "api/notes", $(this).serialize())
      .done(function(note){
        console.log(note)
        $('#note').prepend(
          note_display(note))
          reset_form('#post_note')
      })
  })

first_load()

})
